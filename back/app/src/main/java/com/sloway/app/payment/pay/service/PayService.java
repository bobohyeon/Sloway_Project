package com.sloway.app.payment.pay.service;

import com.sloway.app.common.exception.CustomException;
import com.sloway.app.payment.coupon.common.CouponDcType;
import com.sloway.app.payment.coupon.common.CouponErrorCode;
import com.sloway.app.payment.coupon.common.CouponStatus;
import com.sloway.app.payment.coupon.entity.CouponEntity;
import com.sloway.app.payment.coupon.repository.CouponRepository;
import com.sloway.app.payment.pay.common.PayErrorCode;
import com.sloway.app.payment.pay.common.PayStatus;
import com.sloway.app.payment.pay.dto.request.PayCreateReqDto;
import com.sloway.app.payment.pay.dto.response.PayReadyResDto;
import com.sloway.app.payment.pay.dto.response.PayResDto;
import com.sloway.app.payment.pay.dto.response.PayStatsResDto;
import com.sloway.app.payment.pay.dto.response.TossPrepareResDto;
import com.sloway.app.payment.pay.entity.PayEntity;
import com.sloway.app.payment.pay.pg.kakao.KakaoPayClient;
import com.sloway.app.payment.pay.pg.kakao.dto.request.KakaoApproveReqDto;
import com.sloway.app.payment.pay.pg.kakao.dto.request.KakaoReadyReqDto;
import com.sloway.app.payment.pay.pg.kakao.dto.response.KakaoReadyResDto;
import com.sloway.app.payment.pay.pg.toss.client.TossPayClient;
import com.sloway.app.payment.pay.pg.toss.dto.request.TossConfirmReqDto;
import com.sloway.app.payment.pay.pg.toss.dto.response.TossConfirmResDto;
import com.sloway.app.payment.pay.repository.PayRepository;
import com.sloway.app.payment.point.common.PointErrorCode;
import com.sloway.app.payment.point.service.PointService;
import com.sloway.app.reservation.RsvnErrorCode;
import com.sloway.app.reservation.rsvn.entity.RsvnEntity;
import com.sloway.app.reservation.rsvn.repository.RsvnRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class PayService {

    private final PayRepository payRepository;
    private final CouponRepository couponRepository;
    private final RsvnRepository rsvnRepository;
    private final PointService pointService;
    private final KakaoPayClient kakaoPayClient;
    private final TossPayClient tossPayClient;
    private final PayFailureRecorder payFailureRecorder;

    @Value("${app.base-url}")
    private String baseUrl;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Transactional
    public PayReadyResDto readyPay(PayCreateReqDto payCreateReqDto, Long loginMemberNo) {
        PayEntity payEntity = buildReadyPay(payCreateReqDto, loginMemberNo);

        KakaoReadyReqDto reqDto = KakaoReadyReqDto.builder()
                .partnerOrderId(payEntity.getNo().toString())
                .partnerUserId(payEntity.getRsvnNo().getMemberNo().getNo().toString())
                .itemName("Sloway 공간예약")
                .quantity(1)
                .totalAmount(payEntity.getFinalAmt())
                .taxFreeAmount(0)
                .approvalUrl(baseUrl + "/api/payment/pay/approve?payNo=" + payEntity.getNo())
                .cancelUrl(frontendUrl + "/user/payment/fail")
                .failUrl(frontendUrl + "/user/payment/fail")
                .build();

        KakaoReadyResDto readyResDto = kakaoPayClient.ready(reqDto);
        payEntity.assignTid(readyResDto.getTid());
        return PayReadyResDto.of(payEntity, readyResDto);
    }

    // 카카오 결제창 통과 후  최종 승인하는 단계
    @Transactional
    public PayEntity approvePay(Long payNo, String pgToken) {
        PayEntity payEntity = payRepository.findById(payNo)
                .orElseThrow(() -> new CustomException(PayErrorCode.PAY_NOT_FOUND));
        // 멱등 처리 — 콜백 재호출·뒤로가기로 중복 승인돼도 한 번만 반영
        if (payEntity.getStatus() == PayStatus.COMPLETED) {
            return payEntity;
        }
        Long memberNo = payEntity.getRsvnNo().getMemberNo().getNo();
        KakaoApproveReqDto kakaoApproveReqDto = KakaoApproveReqDto.builder()
                .tid(payEntity.getTid())
                .partnerOrderId(payNo.toString())
                .partnerUserId(memberNo.toString())
                .pgToken(pgToken)
                .build();
        // 승인이 성공한 뒤에만 내부 후 처리(예약 확정·쿠폰·포인트)를 실행
        // PG 호출 실패 시 별도 트랜잭션으로 FAILED 기록 후 예외 전파(READY 영구 잔존 방지)
        try {
            kakaoPayClient.approve(kakaoApproveReqDto);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            log.error("카카오 승인 실패 payNo={}", payNo, e);
            payFailureRecorder.markFailed(payNo);
            throw new CustomException(PayErrorCode.PAY_PROCESS_FAILED);
        }
        completePayAfterApprove(payEntity, memberNo);
        return payEntity;
    }

    // 카카오·토스 승인 후 공통 후처리 — 예약 확정 → 쿠폰 → 포인트
    private void completePayAfterApprove(PayEntity payEntity, Long memberNo) {
        payEntity.getRsvnNo().confirm();   // 결제 성공했으니 예약을 확정 상태로 전이
        payEntity.approvePay();
        // 쿠폰을 쓴 결제만 사용 처리
        if (payEntity.getUcNo() != null) {
            payEntity.getUcNo().useCoupon(payEntity);
        }
        Integer usedPoint = payEntity.getUsedPoint();
        if (usedPoint != null && usedPoint > 0) {
            pointService.usePointInternal(memberNo, payEntity.getUsedPoint(), payEntity);
        }
        pointService.earnPointInternal(memberNo, payEntity);
    }

    @Transactional
    public TossPrepareResDto prepareTossPay(PayCreateReqDto payCreateReqDto, Long loginMemberNo) {
        PayEntity payEntity = buildReadyPay(payCreateReqDto, loginMemberNo);

        String orderId = "SLOWAY_" + payEntity.getNo();
        return TossPrepareResDto.of(payEntity, orderId);
    }

    @Transactional
    public PayResDto confirmTossPay(String paymentKey, String orderId, Integer amount) {
        Long payNo = Long.parseLong(orderId.replace("SLOWAY_", ""));   // prepare 때 붙인 "SLOWAY_" prefix를 떼어 payNo 복원
        PayEntity payEntity = payRepository.findById(payNo)
                .orElseThrow(() -> new CustomException(PayErrorCode.PAY_NOT_FOUND));
        // 멱등 처리 — 중복 호출돼도 한 번만 반영
        if (payEntity.getStatus() == PayStatus.COMPLETED) {
            return PayResDto.from(payEntity);
        }
        // 클라에서 조작한 금액으로 승인되는 것 차단
        if (!amount.equals(payEntity.getFinalAmt())) {
            log.warn("토스 결제 금액 불일치 payNo={}, 요청={}, 서버={}", payNo, amount, payEntity.getFinalAmt());
            throw new CustomException(PayErrorCode.PAY_AMOUNT_INVALID);
        }
        TossConfirmResDto confirmResDto;
        try {
            confirmResDto = tossPayClient.confirm(TossConfirmReqDto.builder()
                    .paymentKey(paymentKey)
                    .orderId(orderId)
                    .amount(amount)
                    .build());
        } catch (Exception e) {
            log.error("토스 승인 실패 payNo={}", payNo, e);
            payFailureRecorder.markFailed(payNo);
            throw new CustomException(PayErrorCode.PAY_PROCESS_FAILED);
        }
        // 토스가 실제 승인 완료 응답일 때만 후 처리 진행
        if (!"DONE".equals(confirmResDto.getStatus())) {
            throw new CustomException(PayErrorCode.PAY_PROCESS_FAILED);
        }
        // 토스 응답의 실제 청구액(totalAmount)을 서버 금액과 재대조(응답 위변조·불일치 방어)
        if (!Objects.equals(confirmResDto.getTotalAmount(), payEntity.getFinalAmt())) {
            log.warn("토스 confirm 응답 금액 불일치 payNo={}, 응답={}, 서버={}",
                    payNo, confirmResDto.getTotalAmount(), payEntity.getFinalAmt());
            throw new CustomException(PayErrorCode.PAY_AMOUNT_INVALID);
        }
        Long memberNo = payEntity.getRsvnNo().getMemberNo().getNo();
        payEntity.assignTid(paymentKey);
        completePayAfterApprove(payEntity, memberNo);
        return PayResDto.from(payEntity);
    }

    private int calculateDcAmt(CouponEntity coupon, Integer baseAmt) {
        if (coupon == null) return 0;
        if (coupon.getDcType() == CouponDcType.FIXED) {
            return coupon.getDcValue();
        } else if (coupon.getDcType() == CouponDcType.RATE) {
            return baseAmt * coupon.getDcValue() / 100;
        }
        return 0;
    }

    public Page<PayResDto> findPayAll(int pno, String tab, String period) {
        PageRequest pageRequest = PageRequest.of(pno, 10);
        return payRepository.findPayAll(pageRequest, toStatus(tab), toFrom(period));
    }

    public PayStatsResDto findPayStats(String period) {
        return payRepository.findPayStats(toFrom(period));
    }

    private PayStatus toStatus(String tab) {
        if (tab == null) return null;
        return switch (tab) {
            case "completed" -> PayStatus.COMPLETED;
            case "refunded" -> PayStatus.CANCELED;
            case "failed" -> PayStatus.FAILED;
            default -> null;
        };
    }

    private LocalDateTime toFrom(String period) {
        if (period == null) return null;
        LocalDateTime now = LocalDateTime.now();
        return switch (period) {
            case "month" -> now.minusDays(30);
            case "3months" -> now.minusDays(90);
            case "6months" -> now.minusDays(180);
            case "year" -> now.minusDays(365);
            default -> null;
        };
    }

    public PayResDto findPayByNo(Long no) {
        PayEntity entity = payRepository.findById(no)
                .orElseThrow(() -> new CustomException(PayErrorCode.PAY_NOT_FOUND));
        return PayResDto.from(entity);
    }

    public List<PayResDto> findPaysByMemberNo(Long memberNo) {
        List<PayEntity> payEntityList = payRepository.findByMember(memberNo);
        return payEntityList.stream().map(PayResDto::from).toList();
    }

    private void validAmt(PayCreateReqDto payCreateReqDto) {
        if (payCreateReqDto.getBaseAmt() == null || payCreateReqDto.getBaseAmt() <= 0 ||
                payCreateReqDto.getAddAmt() == null || payCreateReqDto.getAddAmt() < 0) {
            log.warn("결제 금액 이상치 baseAmt={}, addAmt={}", payCreateReqDto.getBaseAmt(),
                    payCreateReqDto.getAddAmt());
            throw new CustomException(PayErrorCode.PAY_AMOUNT_INVALID);
        }
    }

    private RsvnEntity validRsvn(PayCreateReqDto payCreateReqDto) {
        return rsvnRepository.findById(payCreateReqDto.getRsvnNo())
                .orElseThrow(() -> new CustomException(RsvnErrorCode.RESERVATION_NOT_FOUND));
    }

    private void validFinalAmt(PayCreateReqDto payCreateReqDto, int finalAmt, int dcAmt, int usedPoint) {
        if (finalAmt < 0) {
            log.warn("음수 finalAmt 발생 baseAmt={}, addAmt={}, dcAmt={}, usedPoint={}",
                    payCreateReqDto.getBaseAmt(),
                    payCreateReqDto.getAddAmt(),
                    dcAmt, usedPoint
            );
            throw new CustomException(PayErrorCode.PAY_AMOUNT_NEGATIVE);
        }
        // 0원 결제 차단 — 쿠폰+포인트로 0원이 되면 카카오/토스 PG가 거부해 READY 잔존하므로 사전 차단
        if (finalAmt == 0) {
            log.warn("0원 결제 시도 baseAmt={}, dcAmt={}, usedPoint={}",
                    payCreateReqDto.getBaseAmt(), dcAmt, usedPoint);
            throw new CustomException(PayErrorCode.PAY_AMOUNT_INVALID);
        }
    }

    private void validCoupon(CouponEntity coupon, Long loginMemberNo) {
        // 쿠폰 본인 소유 검증
        if (!Objects.equals(coupon.getMemberNo().getNo(), loginMemberNo)) {
            log.warn("타인 쿠폰 사용 시도 ucNo={}, owner={}, login={}",
                    coupon.getNo(), coupon.getMemberNo().getNo(), loginMemberNo);
            throw new CustomException(CouponErrorCode.COUPON_FORBIDDEN);
        }
        if (coupon.getStatus() != CouponStatus.AVAILABLE) {
            throw new CustomException(CouponErrorCode.COUPON_NOT_AVAILABLE);
        }
        if (coupon.getExpiredAt() != null && coupon.getExpiredAt().isBefore(LocalDateTime.now())) {
            throw new CustomException(CouponErrorCode.COUPON_EXPIRED);
        }
    }

    // 결제자 == 예약 소유자 검증
    private void validRsvnOwner(RsvnEntity rsvn, Long loginMemberNo) {
        Long ownerNo = rsvn.getMemberNo().getNo();
        if (!Objects.equals(ownerNo, loginMemberNo)) {
            log.warn("타인 예약 결제 시도 rsvnNo={}, owner={}, login={}",
                    rsvn.getNo(), ownerNo, loginMemberNo);
            throw new CustomException(PayErrorCode.PAY_FORBIDDEN);
        }
    }

    // 결제 금액 위변조 검증
    private void validAmtMatchesRsvn(PayCreateReqDto payCreateReqDto, RsvnEntity rsvn) {
        int reqTotal = payCreateReqDto.getBaseAmt() + payCreateReqDto.getAddAmt();
        if (rsvn.getAmt() == null || reqTotal != rsvn.getAmt()) {
            log.warn("결제 금액 위변조 의심 rsvnNo={}, 요청총액={}, 예약금액={}",
                    rsvn.getNo(), reqTotal, rsvn.getAmt());
            throw new CustomException(PayErrorCode.PAY_AMOUNT_INVALID);
        }
    }

    // 포인트 음수 입력 방어
    private void validUsedPoint(int usedPoint) {
        if (usedPoint < 0) {
            log.warn("포인트 음수 입력 시도 usedPoint={}", usedPoint);
            throw new CustomException(PointErrorCode.POINT_AMOUNT_INVALID);
        }
    }

    private void validDuplicate(Long rsvnNo) {
        for (PayEntity entity : payRepository.findByRsvn(rsvnNo)) {
            if (entity.getStatus() == PayStatus.COMPLETED) {
                throw new CustomException(PayErrorCode.PAY_DUPLICATE);
            }
        }
    }

    // 카카오·토스 공통 진입점 — API 호출 전에 모든 검증과 finalAmt 계산을 끝내고 저장
    private PayEntity buildReadyPay(PayCreateReqDto payCreateReqDto, Long loginMemberNo){
        validAmt(payCreateReqDto);
        RsvnEntity rsvn = validRsvn(payCreateReqDto);
        validRsvnOwner(rsvn, loginMemberNo);           // 본인 예약만 결제
        validAmtMatchesRsvn(payCreateReqDto, rsvn);    // 결제 금액 위변조
        validDuplicate(rsvn.getNo());                  // 이미 결제 완료된 예약의 재 결제 차단
        CouponEntity coupon = null;
        if (payCreateReqDto.getUcNo() != null) {
            coupon = couponRepository.findById(payCreateReqDto.getUcNo())
                    .orElseThrow(() -> new CustomException(CouponErrorCode.COUPON_NOT_FOUND));
            validCoupon(coupon, loginMemberNo);        // 본인 쿠폰만 사용
        }
        int dcAmt = calculateDcAmt(coupon, payCreateReqDto.getBaseAmt());
        int usedPoint = payCreateReqDto.getUsedPoint() == null
                ? 0 : payCreateReqDto.getUsedPoint();
        validUsedPoint(usedPoint);                     // 포인트 음수 방어
        // 포인트 사전 검증 — approve가 아니라 ready 단계에서 한도(30%)·최소·잔액 체크
        // (프론트 우회·한도초과 시 카카오 승인 후 터지는 정합성 붕괴 방지)
        if (usedPoint > 0) {
            int basisAmt = payCreateReqDto.getBaseAmt() + payCreateReqDto.getAddAmt() - dcAmt;
            pointService.validatePointUsage(loginMemberNo, usedPoint, basisAmt);
        }
        // 결제 총액에서 쿠폰·포인트를 차감한 실제 결제 금액
        int finalAmt = payCreateReqDto.getBaseAmt() + payCreateReqDto.getAddAmt()
                - dcAmt - usedPoint;
        validFinalAmt(payCreateReqDto, finalAmt, dcAmt, usedPoint);
        PayEntity payEntity = payCreateReqDto.toEntity(rsvn, coupon, dcAmt, finalAmt);
        return payRepository.save(payEntity);          // 아직 PG 미호출 — READY 상태로 먼저 저장
    }


}
