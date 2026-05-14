package com.sloway.app.payment.coupon.dto.request;

import com.sloway.app.payment.coupon.common.CouponDcType;
import com.sloway.app.payment.coupon.common.CouponStatus;
import com.sloway.app.payment.coupon.entity.CouponEntity;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class CouponCreateReqDto {

    private String couponName;
    private CouponDcType dcType;
    private Integer dcValue;
    private Long memberNo;
    private LocalDateTime expiredAt;

    public CouponEntity toEntity() {
        return CouponEntity.builder()
                .couponName(couponName)
                .dcType(dcType)
                .dcValue(dcValue)
                .memberNo(memberNo)
                .expiredAt(expiredAt)
                .status(CouponStatus.CREATED)
                .build();
    }
}
