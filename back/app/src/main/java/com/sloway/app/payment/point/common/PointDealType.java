package com.sloway.app.payment.point.common;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum PointDealType {

    USE("사용"),
    EARN("적립");

    private final String label;
}
