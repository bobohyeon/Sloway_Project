package com.sloway.app.payment.coupon.dto.request;

import com.sloway.app.member.entity.MemberEntity;
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

    public CouponEntity toEntity(MemberEntity memberEntity) {
        return CouponEntity.builder()
                .couponName(couponName)
                .dcType(dcType)
                .dcValue(dcValue)
                .memberNo(memberEntity)
                .expiredAt(expiredAt)
                .status(CouponStatus.AVAILABLE)
                .build();
    }
}
