package com.sloway.app.payment.couponevent.common;

import com.sloway.app.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum CouponEventErrorCode implements ErrorCode {

    COUPONEVENT_NOT_FOUND(HttpStatus.NOT_FOUND, "쿠폰 정보를 조회할 수 없습니다."),
    COUPONEVENT_ALREADY_CLOSED(HttpStatus.BAD_REQUEST, "종료된 쿠폰 입니다."),
    COUPONEVENT_SOLDOUT(HttpStatus.BAD_REQUEST, "남은 쿠폰이 없습니다."),
    COUPONEVENT_ALREADY_DOWNLOADED(HttpStatus.BAD_REQUEST, "쿠폰을 발급 받을 수 없습니다.");

    private final HttpStatus status;
    private final String msg;
}
