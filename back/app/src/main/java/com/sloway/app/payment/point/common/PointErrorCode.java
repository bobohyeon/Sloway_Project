package com.sloway.app.payment.point.common;

import com.sloway.app.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum PointErrorCode implements ErrorCode {

    POINT_INSUFFICIENT(HttpStatus.BAD_REQUEST,"포인트 잔액이 부족합니다."),
    POINT_BELOW_MIN(HttpStatus.BAD_REQUEST,"최소 1000P부터 사용할 수 있습니다."),
    POINT_EXCEED_LIMIT(HttpStatus.BAD_REQUEST,"한도 30%를 초과했습니다.");

    private final HttpStatus status;
    private final String msg;
}
