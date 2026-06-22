package com.sloway.app.payment.refund.common;

import com.sloway.app.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum RefundErrorCode implements ErrorCode {

    REFUND_NOT_FOUND(HttpStatus.NOT_FOUND, "환불 정보를 조회할 수 없습니다."),
    REFUND_NOT_REQUESTED(HttpStatus.BAD_REQUEST, "환불 요청 상태가 아닙니다."),
    REFUND_NOT_APPROVED(HttpStatus.BAD_REQUEST, "환불 승인 상태가 아닙니다."),
    REFUND_AMOUNT_INVALID(HttpStatus.BAD_REQUEST, "환불 금액이 올바르지 않습니다."),
    REFUND_DUPLICATE(HttpStatus.CONFLICT, "환불 중복 시도입니다."),
    REFUND_FORBIDDEN(HttpStatus.FORBIDDEN, "본인의 결제만 환불할 수 있습니다."),
    REFUND_DDAY_NOT_ALLOWED(HttpStatus.BAD_REQUEST, "이용 당일에는 취소·환불할 수 없습니다.");

    private final HttpStatus status;
    private final String msg;
}
