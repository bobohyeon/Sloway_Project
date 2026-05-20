package com.sloway.app.payment.point.common;

import com.sloway.app.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum PointErrorCode implements ErrorCode {

    POINT_INSUFFICIENT(HttpStatus.BAD_REQUEST, "포인트 잔액이 부족합니다."),
    POINT_BELOW_MIN(HttpStatus.BAD_REQUEST, "최소 1000P부터 사용할 수 있습니다."),
    POINT_EXCEED_LIMIT(HttpStatus.BAD_REQUEST, "결제 금액의 30%까지만 사용 가능합니다."),
    POINT_NOT_FOUND(HttpStatus.NOT_FOUND, "포인트 정보를 조회할 수 없습니다."),
    POINT_NOT_WAIT(HttpStatus.BAD_REQUEST, "적립 대기 상태가 아닙니다."),
    POINT_NOT_HOLDABLE(HttpStatus.BAD_REQUEST, "만료 또는 취소 가능한 상태가 아닙니다."),
    POINT_NOT_USED(HttpStatus.BAD_REQUEST, "사용 상태가 아닙니다."),
    POINT_ALREADY_EXPIRED(HttpStatus.BAD_REQUEST, "이미 만료된 포인트입니다."),
    POINT_NOT_ENOUGH(HttpStatus.BAD_REQUEST, "환불될 포인트가 없습니다."),
    POINT_AMOUNT_INVALID(HttpStatus.BAD_REQUEST, "포인트 금액이 올바르지 않습니다.");

    private final HttpStatus status;
    private final String msg;
}
