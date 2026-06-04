package com.sloway.app.payment.settlement.fee.common;

import com.sloway.app.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum FeeErrorCode implements ErrorCode {

    FEE_NOT_FOUND(HttpStatus.NOT_FOUND,"수수료 정책을 찾을 수 없습니다.");

    private final HttpStatus status;
    private final String msg;
}
