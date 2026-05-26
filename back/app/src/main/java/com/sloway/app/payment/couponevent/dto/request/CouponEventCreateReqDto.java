package com.sloway.app.payment.couponevent.dto.request;

import com.sloway.app.payment.coupon.common.CouponDcType;
import com.sloway.app.payment.couponevent.common.CouponEventStatus;
import com.sloway.app.payment.couponevent.entity.CouponEventEntity;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class CouponEventCreateReqDto {

    private String couponName;
    private CouponDcType dcType;
    private Integer dcValue;
    private Integer validDays;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private Integer totalCount;

    public CouponEventEntity toEntity(){
        return CouponEventEntity.builder()
                .couponName(couponName)
                .dcType(dcType)
                .dcValue(dcValue)
                .validDays(validDays)
                .startAt(startAt)
                .endAt(endAt)
                .totalCount(totalCount)
                .issuedCount(0)
                .status(CouponEventStatus.OPEN)
                .build();

    }
}
