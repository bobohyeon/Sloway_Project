package com.sloway.app.payment.settlement.settle.common;

import com.sloway.app.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum SettleErrorCode implements ErrorCode {

    SETTLE_NOT_FOUND(HttpStatus.NOT_FOUND, "정산 정보를 조회할 수 없습니다."),
    FEE_POLICY_NOT_FOUND(HttpStatus.NOT_FOUND, "수수료 정책을 조회할 수 없습니다."),
    SETTLE_NOT_WAITING(HttpStatus.CONFLICT, "정산 대기중이 아닙니다."),
    SETTLE_NOT_COMPLETED(HttpStatus.CONFLICT, "정산이 완료되지 않았습니다.");

    private final HttpStatus status;
    private final String msg;


}
