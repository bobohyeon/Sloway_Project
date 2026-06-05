package com.sloway.app.payment.pay.service;

import com.sloway.app.common.exception.CustomException;
import com.sloway.app.payment.coupon.common.CouponDcType;
import com.sloway.app.payment.coupon.common.CouponErrorCode;
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

    @Value("${app.base-url}")
    private String baseUrl;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Transactional
    public PayReadyResDto readyPay(PayCreateReqDto payCreateReqDto) {
        PayEntity payEntity = buildReadyPay(payCreateReqDto);

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

    @Transactional
    public PayEntity approvePay(Long payNo, String pgToken) {
        PayEntity payEntity = payRepository.findById(payNo)
                .orElseThrow(() -> new CustomException(PayErrorCode.PAY_NOT_FOUND));

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

        kakaoPayClient.approve(kakaoApproveReqDto);
        completePayAfterApprove(payEntity, memberNo);
        return payEntity;
    }

    private void completePayAfterApprove(PayEntity payEntity, Long memberNo) {
        payEntity.getRsvnNo().confirm();
        payEntity.approvePay();

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
    public TossPrepareResDto prepareTossPay(PayCreateReqDto payCreateReqDto) {
        PayEntity payEntity = buildReadyPay(payCreateReqDto);

        String orderId = "SLOWAY_" + payEntity.getNo();
        return TossPrepareResDto.of(payEntity, orderId);
    }

    @Transactional
    public PayResDto confirmTossPay(String paymentKey, String orderId, Integer amount) {
        Long payNo = Long.parseLong(orderId.replace("SLOWAY_", ""));
        PayEntity payEntity = payRepository.findById(payNo)
                .orElseThrow(() -> new CustomException(PayErrorCode.PAY_NOT_FOUND));

        if (payEntity.getStatus() == PayStatus.COMPLETED) {
            return PayResDto.from(payEntity);
        }

        if (!amount.equals(payEntity.getFinalAmt())) {
            log.warn("토스 결제 금액 불일치 payNo={}, 요청={}, 서버={}", payNo, amount, payEntity.getFinalAmt());
            throw new CustomException(PayErrorCode.PAY_AMOUNT_INVALID);
        }

        TossConfirmResDto confirmResDto = tossPayClient.confirm(TossConfirmReqDto.builder()
                .paymentKey(paymentKey)
                .orderId(orderId)
                .amount(amount)
                .build());

        if (!"DONE".equals(confirmResDto.getStatus())) {
            throw new CustomException(PayErrorCode.PAY_PROCESS_FAILED);
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
    }

    private void validDuplicate(Long rsvnNo) {
        for (PayEntity entity : payRepository.findByRsvn(rsvnNo)) {
            if (entity.getStatus() == PayStatus.COMPLETED) {
                throw new CustomException(PayErrorCode.PAY_DUPLICATE);
            }
        }
    }

    private PayEntity buildReadyPay(PayCreateReqDto payCreateReqDto){
        validAmt(payCreateReqDto);
        RsvnEntity rsvn = validRsvn(payCreateReqDto);
        validDuplicate(rsvn.getNo());

        CouponEntity coupon = null;
        if (payCreateReqDto.getUcNo() != null) {
            coupon = couponRepository.findById(payCreateReqDto.getUcNo())
                    .orElseThrow(() -> new CustomException(CouponErrorCode.COUPON_NOT_FOUND));
        }

        int dcAmt = calculateDcAmt(coupon, payCreateReqDto.getBaseAmt());
        int usedPoint = payCreateReqDto.getUsedPoint() == null
                ? 0 : payCreateReqDto.getUsedPoint();

        int finalAmt = payCreateReqDto.getBaseAmt() + payCreateReqDto.getAddAmt()
                - dcAmt - usedPoint;

        validFinalAmt(payCreateReqDto, finalAmt, dcAmt, usedPoint);

        PayEntity payEntity = payCreateReqDto.toEntity(rsvn, coupon, dcAmt, finalAmt);
        return payRepository.save(payEntity);
    }


}
