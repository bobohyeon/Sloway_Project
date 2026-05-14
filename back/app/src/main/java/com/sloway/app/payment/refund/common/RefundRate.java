package com.sloway.app.payment.refund.common;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum RefundRate {
    WEEK("일주일", 100),
    FOURTOSIX("4~6일", 70),
    TWOTOTHREE("2~3일", 50),
    ONEDAY("1일", 30),
    DDAY("당일", 0);

    private final String label;
    private final Integer rate;
}
