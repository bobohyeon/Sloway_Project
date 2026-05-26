package com.sloway.app.payment.couponevent.dto.response;

import com.sloway.app.payment.coupon.common.CouponDcType;
import com.sloway.app.payment.couponevent.common.CouponEventStatus;
import com.sloway.app.payment.couponevent.entity.CouponEventEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CouponEventResDto {

    private Long no;
    private String couponName;
    private CouponDcType dcType;
    private Integer dcValue;
    private Integer validDays;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private Integer totalCount;
    private Integer issuedCount;
    private CouponEventStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;

    public static CouponEventResDto from(CouponEventEntity entity) {
        return CouponEventResDto.builder()
                .no(entity.getNo())
                .couponName(entity.getCouponName())
                .dcType(entity.getDcType())
                .dcValue(entity.getDcValue())
                .validDays(entity.getValidDays())
                .startAt(entity.getStartAt())
                .endAt(entity.getEndAt())
                .totalCount(entity.getTotalCount())
                .issuedCount(entity.getIssuedCount())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .modifiedAt(entity.getModifiedAt())
                .build();
    }
}
