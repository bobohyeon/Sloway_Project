package com.sloway.app.payment.couponevent.common;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum CouponEventStatus {

    OPEN("쿠폰 게시"),
    CLOSED("쿠폰 게시 종료"),
    SOLDOUT("쿠폰 소진");

    private final String label;
}
