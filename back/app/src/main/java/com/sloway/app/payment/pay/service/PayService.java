package com.sloway.app.payment.pay.service;

import com.sloway.app.common.exception.CustomException;
import com.sloway.app.payment.coupon.common.CouponDcType;
import com.sloway.app.payment.coupon.common.CouponErrorCode;
import com.sloway.app.payment.coupon.entity.CouponEntity;
import com.sloway.app.payment.coupon.repository.CouponRepository;
import com.sloway.app.payment.pay.common.PayErrorCode;
import com.sloway.app.payment.pay.dto.request.PayCreateReqDto;
import com.sloway.app.payment.pay.dto.response.PayReadyResDto;
import com.sloway.app.payment.pay.dto.response.PayResDto;
import com.sloway.app.payment.pay.entity.PayEntity;
import com.sloway.app.payment.pay.pg.kakao.KakaoPayClient;
import com.sloway.app.payment.pay.pg.kakao.dto.request.KakaoReadyReqDto;
import com.sloway.app.payment.pay.pg.kakao.dto.response.KakaoReadyResDto;
import com.sloway.app.payment.pay.repository.PayRepository;
import com.sloway.app.payment.point.service.PointService;
import com.sloway.app.reservation.rsvn.entity.RsvnEntity;
import com.sloway.app.reservation.rsvn.repository.RsvnRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Value("${app.base-url}")
    private String baseUrl;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Transactional
    public PayReadyResDto readyPay(PayCreateReqDto payCreateReqDto) {
        validAmt(payCreateReqDto);
        RsvnEntity rsvn = validRsvn(payCreateReqDto);

        Long memberNo = rsvn.getMemberNo().getNo();

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
        payRepository.save(payEntity);

        KakaoReadyReqDto reqDto = KakaoReadyReqDto.builder()
                .partnerOrderId(payEntity.getNo().toString())
                .partnerUserId(memberNo.toString())
                .itemName("Sloway 공간예약")
                .quantity(1)
                .totalAmount(finalAmt)
                .taxFreeAmount(0)
                .approvalUrl(baseUrl + "/api/payment/pay/approve?payNo=" + payEntity.getNo())
                .cancelUrl(frontendUrl + "/user/payment/fail")
                .failUrl(frontendUrl + "/user/payment/fail")
                .build();

        KakaoReadyResDto readyResDto = kakaoPayClient.ready(reqDto);
        payEntity.assignTid(readyResDto.getTid());
        return PayReadyResDto.of(payEntity, readyResDto);
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

    public List<PayResDto> findPayAll() {
        return payRepository.findAll().stream().map(PayResDto::from).toList();
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
                .orElseThrow(() -> new EntityNotFoundException("예약 정보를 조회할 수 없습니다."));
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


}
