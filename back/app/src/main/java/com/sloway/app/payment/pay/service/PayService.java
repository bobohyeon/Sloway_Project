package com.sloway.app.payment.pay.service;

import com.sloway.app.common.exception.CustomException;
import com.sloway.app.payment.coupon.entity.CouponEntity;
import com.sloway.app.payment.coupon.repository.CouponRepository;
import com.sloway.app.payment.pay.common.PayErrorCode;
import com.sloway.app.payment.pay.dto.request.PayCreateReqDto;
import com.sloway.app.payment.pay.dto.response.PayResDto;
import com.sloway.app.payment.pay.entity.PayEntity;
import com.sloway.app.payment.pay.repository.PayRepository;
import com.sloway.app.payment.point.entity.PointEntity;
import com.sloway.app.payment.point.repository.PointRepository;
import com.sloway.app.reservation.rsvn.entity.RsvnEntity;
import com.sloway.app.reservation.rsvn.repository.RsvnRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class PayService {

    private final PayRepository payRepository;
    private final CouponRepository couponRepository;
    private final RsvnRepository rsvnRepository;
    private final PointRepository pointRepository;

    @Transactional
    public PayResDto createPay(PayCreateReqDto payCreateReqDto) {

        if(payCreateReqDto.getBaseAmt() == null || payCreateReqDto.getBaseAmt() <= 0 ||
                payCreateReqDto.getAddAmt() == null || payCreateReqDto.getAddAmt() < 0){
            log.warn("결제 금액 이상치 baseAmt={}, addAmt={}", payCreateReqDto.getBaseAmt(),
                    payCreateReqDto.getAddAmt());
            throw new CustomException(PayErrorCode.PAY_AMOUNT_INVALID);
        }

        RsvnEntity rsvn = rsvnRepository.findById(payCreateReqDto.getRsvnNo())
                .orElseThrow(() -> new EntityNotFoundException("예약 정보를 조회할 수 없습니다."));

        CouponEntity coupon = null;
        if (payCreateReqDto.getUcNo() != null) {
            coupon = couponRepository.findById(payCreateReqDto.getUcNo())
                    .orElseThrow(() -> new EntityNotFoundException("쿠폰 정보를 조회할 수 없습니다."));
        }



        PayEntity entity = payCreateReqDto.toEntity(rsvn, coupon);
        payRepository.save(entity);

        if (coupon != null) {
            coupon.useCoupon(entity);
        }


        String fakeTid = createFakeTid();
        entity.completeAsLevel1(fakeTid);
        return PayResDto.from(entity);
    }

    public List<PayResDto> findPayAll() {
        return payRepository.findAll().stream().map(PayResDto::from).toList();
    }

    public PayResDto findPayByNo(Long no) {
        PayEntity entity = payRepository.findById(no)
                .orElseThrow(() ->  new CustomException(PayErrorCode.PAY_NOT_FOUND));
        return PayResDto.from(entity);
    }

    private String createFakeTid() {
        return "FAKE_" + UUID.randomUUID().toString().substring(0, 12);
    }



}
