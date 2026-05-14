package com.sloway.app.payment.settlement.settle.common;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum SettleStatus {

    WAITING("정산 대기"),
    COMPLETE("정산 완료"),
    INVOICE("세금계산서 발행");

    private final String label;
}
