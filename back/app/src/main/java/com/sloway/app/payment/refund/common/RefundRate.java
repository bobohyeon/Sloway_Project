package com.sloway.app.payment.refund.common;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum RefundRate {
    WEEK(7, 100),
    FOURTOSIX(4, 70),
    TWOTOTHREE(2, 50),
    ONEDAY(1, 30),
    DDAY(0, 0),
    FULL(null, 100);

    private final Integer minday;
    private final Integer rate;
}
