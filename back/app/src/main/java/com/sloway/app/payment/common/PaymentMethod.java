package com.sloway.app.payment.common;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum PaymentMethod {

    KAKAOPAY("카카오페이"),
    TOSSPAY("토스페이"),
    NAVERPAY("네이버페이");

    private final String label;
}
