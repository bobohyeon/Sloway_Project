package com.sloway.app.payment.refund.common;

import com.sloway.app.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum RefundErrorCode implements ErrorCode {

    REFUND_PERIOD_EXPIRED(HttpStatus.BAD_REQUEST,"환불 가능 기간이 지났습니다.");

    private final HttpStatus status;
    private final String msg;
}
