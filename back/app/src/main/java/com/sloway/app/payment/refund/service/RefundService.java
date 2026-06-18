package com.sloway.app.payment.refund.service;

import com.sloway.app.common.exception.CustomException;
import com.sloway.app.payment.pay.common.PayErrorCode;
import com.sloway.app.payment.pay.common.PayMethod;
import com.sloway.app.payment.pay.common.PayStatus;
import com.sloway.app.payment.pay.entity.PayEntity;
import com.sloway.app.payment.pay.pg.kakao.KakaoPayClient;
import com.sloway.app.payment.pay.pg.kakao.dto.request.KakaoCancelReqDto;
import com.sloway.app.payment.pay.pg.toss.client.TossPayClient;
import com.sloway.app.payment.pay.repository.PayRepository;
import com.sloway.app.payment.point.service.PointService;
import com.sloway.app.payment.refund.common.RefundErrorCode;
import com.sloway.app.payment.refund.common.RefundRate;
import com.sloway.app.payment.refund.common.RefundStatus;
import com.sloway.app.payment.refund.dto.request.RefundCreateReqDto;
import com.sloway.app.payment.refund.dto.response.RefundResDto;
import com.sloway.app.payment.refund.dto.response.RefundStatsResDto;
import com.sloway.app.payment.refund.entity.RefundEntity;
import com.sloway.app.payment.refund.repository.RefundRepository;
import com.sloway.app.reservation.RsvnErrorCode;
import com.sloway.app.reservation.rsvn.entity.RsvnEntity;
import com.sloway.app.reservation.rsvn.repository.RsvnRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Objects;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class RefundService {

    private final RefundRepository refundRepository;
    private final PayRepository payRepository;
    private final RsvnRepository rsvnRepository;
    private final PointService pointService;
    private final KakaoPayClient kakaoPayClient;
    private final TossPayClient tossPayClient;

    // 환불 생성 진입점 — 환불 가능 여부를 검증한 뒤, 이용 예정일까지 남은 기간 기준으로 환불액 산정
    @Transactional
    public RefundResDto createRefund(RefundCreateReqDto refundCreateReqDto, Long loginMemberNo) {
        PayEntity payEntity = validRefundablePay(refundCreateReqDto.getPayNo());   // 환불 가능한 결제인지 검증(완료 상태·금액)
        validRefundOwner(payEntity, loginMemberNo);   // 본인 결제만 환불
        RsvnEntity rsvn = rsvnRepository.findById(refundCreateReqDto.getRsvnNo())
                .orElseThrow(() -> new CustomException(RsvnErrorCode.RESERVATION_NOT_FOUND));
        RefundEntity refundEntity = refundCreateReqDto.toEntity(payEntity, rsvn);
        RefundRate rate = refundRate(refundEntity);
        validDuplicate(payEntity);   // 이미 환불된 건은 중복 환불 차단
        if (RefundRate.DDAY == rate) {
            log.warn("환불 기간 만료 : payNo:{},rsvnNo:{}", refundCreateReqDto.getPayNo(), refundCreateReqDto.getRsvnNo());
            throw new CustomException(RefundErrorCode.REFUND_PERIOD_EXPIRED);
        }
        // 남은 기간별 환불율(rate)을 결제액(finalAmt)에 적용해 환불액 산정
        BigDecimal finalAmt = BigDecimal.valueOf(payEntity.getFinalAmt());
        BigDecimal rateBd = BigDecimal.valueOf(rate.getRate());
        BigDecimal divisor = BigDecimal.valueOf(100);
        BigDecimal refundAmt = finalAmt.multiply(rateBd).divide(divisor, 0, RoundingMode.DOWN);
        refundEntity.applyRefund(rate, refundAmt);
        RefundEntity entity = refundRepository.save(refundEntity);
        doRefundProcess(entity);
        return RefundResDto.from(entity);
    }

    @Transactional
    public RefundResDto createRefundByHost(Long payNo) {
        PayEntity payEntity = validRefundablePay(payNo);
        validDuplicate(payEntity);

        RefundEntity refundEntity = RefundEntity.builder()
                .payNo(payEntity)
                .rsvnNo(payEntity.getRsvnNo())
                .refundReason(null)
                .requestedAt(LocalDateTime.now())
                .status(RefundStatus.REQUESTED)
                .build();

        BigDecimal refundAmt = BigDecimal.valueOf(payEntity.getFinalAmt());

        refundEntity.applyRefund(RefundRate.FULL, refundAmt);
        RefundEntity entity = refundRepository.save(refundEntity);
        doRefundProcess(entity);
        return RefundResDto.from(entity);
    }


    @Transactional
    public RefundResDto processRefund(Long refundNo) {
        RefundEntity refundEntity = refundRepository.findById(refundNo)
                .orElseThrow(() -> new CustomException(RefundErrorCode.REFUND_NOT_FOUND));
        doRefundProcess(refundEntity);
        return RefundResDto.from(refundEntity);
    }

    // 환불 실제 처리
    private void doRefundProcess(RefundEntity refundEntity) {
        refundEntity.approveRefund();
        PayEntity payEntity = refundEntity.getPayNo();
        // 사용한 쿠폰 회수 처리
        if (payEntity.getUcNo() != null) {
            payEntity.getUcNo().returnCoupon();
        }
        // 적립 포인트 선 취소 후 복원
        pointService.cancelEarnedPoint(payEntity);
        pointService.refundUsedPoint(payEntity);
        // 카카오/토스 결제 취소 호출
        PayMethod method = payEntity.getMethod();
        if (method == PayMethod.KAKAOPAY) {
            KakaoCancelReqDto cancelReqDto = KakaoCancelReqDto.builder()
                    .tid(payEntity.getTid())
                    .cancelAmount(payEntity.getFinalAmt())
                    .cancelTaxFreeAmount(0)
                    .build();
            kakaoPayClient.cancel(cancelReqDto);
        } else if (method == PayMethod.TOSSPAY) {
            tossPayClient.cancel(payEntity.getTid(), "고객 환불 요청");
        }
        payEntity.cancelPay();
        refundEntity.completeRefund();
        refundEntity.getRsvnNo().cancel();  // confirm()과 동일한 패턴 — 환불 완료 시 예약 상태 C로 전이
    }

    // 어드민 환불 목록 (서버 페이징 + 탭/기간 필터) — 결제 findPayAll 과 동형
    public Page<RefundResDto> findRefundAll(int pno, String tab, String period) {
        PageRequest pageRequest = PageRequest.of(pno, 10);
        return refundRepository.findRefundAll(pageRequest, tab, toFrom(period));
    }

    public RefundStatsResDto findRefundStats() {
        return refundRepository.findRefundStats();
    }

    // RefundFilterBar 기간값 → 컷오프 시각. 'all'/null 은 기간 필터 안 함
    private LocalDateTime toFrom(String period) {
        if (period == null) return null;
        LocalDateTime now = LocalDateTime.now();
        return switch (period) {
            case "today" -> now.minusDays(1);
            case "week" -> now.minusDays(7);
            case "month" -> now.minusDays(30);
            case "3months" -> now.minusDays(90);
            default -> null;
        };
    }

    public RefundResDto findRefundByNo(Long no) {
        RefundEntity refundEntity = refundRepository.findById(no)
                .orElseThrow(() -> new CustomException(RefundErrorCode.REFUND_NOT_FOUND));
        return RefundResDto.from(refundEntity);
    }

    // 결제 상세 화면용 — 연관 환불 단건. 환불 없으면 null (예외 X, 정상 케이스)
    public RefundResDto findRefundByPayNo(Long payNo) {
        RefundEntity refundEntity = refundRepository.findByPay(payNo);
        return refundEntity == null ? null : RefundResDto.from(refundEntity);
    }

    public List<RefundResDto> findRefundsByMemberNo(Long memberNo) {
        List<RefundEntity> refundEntityList = refundRepository.findByMember(memberNo);
        return refundEntityList.stream().map(RefundResDto::from).toList();
    }

    // 이용 예정일까지 남은 일수 확인 후 환불율을 차등 반환
    private RefundRate refundRate(RefundEntity entity) {
        LocalDateTime checkIn = entity.getRsvnNo().getCheckIn();
        LocalDateTime requestedAt = entity.getRequestedAt();
        long between = ChronoUnit.DAYS.between(requestedAt.toLocalDate(), checkIn.toLocalDate());
        if (between >= RefundRate.WEEK.getMinday()) {
            return RefundRate.WEEK;
        } else if (between >= RefundRate.FOURTOSIX.getMinday()) {
            return RefundRate.FOURTOSIX;
        } else if (between >= RefundRate.TWOTOTHREE.getMinday()) {
            return RefundRate.TWOTOTHREE;
        } else if (between >= RefundRate.ONEDAY.getMinday()) {
            return RefundRate.ONEDAY;
        } else {
            return RefundRate.DDAY;
        }
    }

    // ④ 환불 요청자 == 결제 소유자 검증
    private void validRefundOwner(PayEntity payEntity, Long loginMemberNo) {
        Long ownerNo = payEntity.getRsvnNo().getMemberNo().getNo();
        if (!Objects.equals(ownerNo, loginMemberNo)) {
            log.warn("타인 결제 환불 시도 payNo={}, owner={}, login={}",
                    payEntity.getNo(), ownerNo, loginMemberNo);
            throw new CustomException(RefundErrorCode.REFUND_FORBIDDEN);
        }
    }

    private PayEntity validRefundablePay(Long payNo) {
        PayEntity payEntity = payRepository.findById(payNo)
                .orElseThrow(() -> new CustomException(PayErrorCode.PAY_NOT_FOUND));
        if (payEntity.getStatus() != PayStatus.COMPLETED) {
            throw new CustomException(PayErrorCode.PAY_NOT_COMPLETED);
        }

        if (payEntity.getFinalAmt() == null || payEntity.getFinalAmt() <= 0) {
            throw new CustomException(RefundErrorCode.REFUND_AMOUNT_INVALID);
        }
        return payEntity;
    }

    private void validDuplicate(PayEntity payEntity) {
        boolean exists = refundRepository.existsByPayAndStatus(
                payEntity.getNo(),
                List.of(RefundStatus.REQUESTED,
                        RefundStatus.APPROVED,
                        RefundStatus.COMPLETED)
        );

        if (exists) {
            log.warn("중복 환불 시도 : payNo={}", payEntity.getNo());
            throw new CustomException(RefundErrorCode.REFUND_DUPLICATE);
        }
    }


}
