package com.sloway.app.payment.pay.common;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum PayStatus {

    READY("결제 준비"),
    COMPLETED("결제 완료"),
    FAILED("결제 실패"),
    CANCELED("결제 취소");

    private final String label;
}
