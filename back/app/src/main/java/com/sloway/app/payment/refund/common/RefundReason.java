package com.sloway.app.payment.refund.common;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum RefundReason {
    SCHEDULE("일정이 변경됐어요"),
    SPACE("다른 공간으로 변경하려고요"),
    HEALTH("건강상의 이유"),
    PERSONAL("개인 사정 / 긴급 상황"),
    PRICE("가격이 부담돼요"),
    ETC("기타");

    private final String label;
}
