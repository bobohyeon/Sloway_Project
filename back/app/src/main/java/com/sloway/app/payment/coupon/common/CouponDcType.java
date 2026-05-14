package com.sloway.app.payment.coupon.common;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum CouponDcType {
    FIXED("정액"),
    RATE("정률");

    private final String label;
}
