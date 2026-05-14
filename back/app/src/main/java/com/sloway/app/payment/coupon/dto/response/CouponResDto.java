package com.sloway.app.payment.coupon.dto.response;

import com.sloway.app.payment.coupon.common.CouponDcType;
import com.sloway.app.payment.coupon.common.CouponStatus;
import com.sloway.app.payment.coupon.entity.CouponEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CouponResDto {

    private Long no;
    private CouponStatus status;
    private String couponName;
    private CouponDcType dcType;
    private Integer dcValue;
    private Long memberNo;
    private LocalDateTime expiredAt;
    private LocalDateTime usedAt;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
    private String delYn;
    private Long payNo;



    public static CouponResDto from(CouponEntity entity) {
        return CouponResDto.builder()
                .no(entity.getNo())
                .status(entity.getStatus())
                .couponName(entity.getCouponName())
                .dcType(entity.getDcType())
                .dcValue(entity.getDcValue())
                .memberNo(entity.getMemberNo())
                .expiredAt(entity.getExpiredAt())
                .usedAt(entity.getUsedAt())
                .payNo(entity.getPayNo())
                .createdAt(entity.getCreatedAt())
                .modifiedAt(entity.getModifiedAt())
                .delYn(entity.getDelYn())
                .build();
    }
}
