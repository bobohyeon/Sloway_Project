package com.sloway.app.payment.coupon.dto.response;

import com.sloway.app.payment.coupon.entity.CouponEntity;
import lombok.Builder;
import lombok.Getter;

// TODO: 쿠폰 응답 DTO
@Getter
@Builder
public class CouponResDto {

    // TODO: 응답 필드 정의

    public static CouponResDto from(CouponEntity entity) {
        // TODO: 빌더로 매핑
        return null;
    }
}
