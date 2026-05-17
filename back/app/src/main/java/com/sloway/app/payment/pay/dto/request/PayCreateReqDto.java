package com.sloway.app.payment.pay.dto.request;

import com.sloway.app.payment.coupon.entity.CouponEntity;
import com.sloway.app.payment.pay.common.PayMethod;
import com.sloway.app.payment.pay.common.PayStatus;
import com.sloway.app.payment.pay.entity.PayEntity;
import com.sloway.app.reservation.rsvn.entity.RsvnEntity;
import lombok.Getter;

@Getter
public class PayCreateReqDto {

    private Long rsvnNo;
    private Long ucNo;
    private PayMethod method;
    private Integer baseAmt;
    private Integer addAmt;

    public PayEntity toEntity(RsvnEntity rsvnEntity,CouponEntity couponEntity) {
        return PayEntity.builder()
                .rsvnNo(rsvnEntity)
                .ucNo(couponEntity)
                .method(method)
                .baseAmt(baseAmt)
                .addAmt(addAmt)
                .finalAmt(baseAmt+addAmt)
                .status(PayStatus.READY)
                .usedPoint(0)
                .dcAmt(0)
                .build();
    }
}
