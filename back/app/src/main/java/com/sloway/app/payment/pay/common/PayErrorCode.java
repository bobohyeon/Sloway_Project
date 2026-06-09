package com.sloway.app.payment.pay.common;

import com.sloway.app.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum PayErrorCode implements ErrorCode {

    PAY_NOT_FOUND(HttpStatus.NOT_FOUND, "결제 정보를 조회할 수 없습니다."),
    PAY_AMOUNT_INVALID(HttpStatus.BAD_REQUEST, "결제 금액이 올바르지 않습니다."),
    PAY_ALREADY_COMPLETED(HttpStatus.BAD_REQUEST, "이미 완료된 결제입니다."),
    PAY_NOT_COMPLETED(HttpStatus.BAD_REQUEST, "결제가 완료되지 않았습니다."),
    PAY_ALREADY_CANCELED(HttpStatus.BAD_REQUEST, "취소된 결제입니다."),
    PAY_DUPLICATE(HttpStatus.CONFLICT, "결제 중복 시도입니다."),
    PAY_PROCESS_FAILED(HttpStatus.BAD_GATEWAY, "PG 통신 실패입니다."),
    PAY_AMOUNT_NEGATIVE(HttpStatus.BAD_REQUEST, "결제 금액은 음수가 될 수 없습니다."),
    PAY_FORBIDDEN(HttpStatus.FORBIDDEN, "본인의 예약만 결제할 수 있습니다.");

    private final HttpStatus status;
    private final String msg;
}
