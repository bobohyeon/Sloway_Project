package com.sloway.app.payment.refund.common;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum RefundStatus {

    REQUESTED("환불 요청"),
    APPROVED("환불 승인"),
    COMPLETED("환불 완료"),
    FAILED("환불 실패");

    private final String label;
}
