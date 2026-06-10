package com.sloway.app.payment.coupon.common;

import com.sloway.app.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum CouponErrorCode implements ErrorCode {

    COUPON_NOT_FOUND(HttpStatus.NOT_FOUND, "쿠폰을 조회할 수 없습니다."),
    COUPON_NOT_AVAILABLE(HttpStatus.BAD_REQUEST, "사용 가능한 쿠폰이 아닙니다."),
    COUPON_NOT_EXPIRABLE(HttpStatus.BAD_REQUEST, "사용 가능한 쿠폰만 만료 처리 가능합니다."),
    COUPON_EXPIRED(HttpStatus.BAD_REQUEST, "만료된 쿠폰입니다."),
    COUPON_NOT_USED(HttpStatus.BAD_REQUEST, "사용된 쿠폰만 회수 처리 가능합니다."),
    COUPON_ALREADY_USED(HttpStatus.CONFLICT, "이미 사용된 쿠폰입니다."),
    COUPON_FORBIDDEN(HttpStatus.FORBIDDEN, "본인의 쿠폰만 사용할 수 있습니다.");

    private final HttpStatus status;
    private final String msg;
}
