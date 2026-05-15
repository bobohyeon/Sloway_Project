package com.sloway.app.payment.coupon.common;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum CouponStatus {
    AVAILABLE("사용가능"),
    USED("사용완료"),
    EXPIRED("만료"),
    RETURNED("회수");

    private final String label;
}
