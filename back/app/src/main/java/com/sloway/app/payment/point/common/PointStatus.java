package com.sloway.app.payment.point.common;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum PointStatus {

    SAVE("적립확정"),
    USED("사용완료"),
    EXPIRATION("만료"),
    CANCEL("취소");

    private final String label;
}
