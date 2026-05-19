package com.sloway.app.payment.coupon.common;

import com.sloway.app.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum CouponErrorCode implements ErrorCode {

    // 사용 중 (3개)
    COUPON_NOT_FOUND(HttpStatus.NOT_FOUND, "쿠폰을 조회할 수 없습니다."),
    COUPON_NOT_AVAILABLE(HttpStatus.BAD_REQUEST, "사용 가능한 쿠폰이 아닙니다."),
    COUPON_NOT_EXPIRABLE(HttpStatus.BAD_REQUEST, "사용 가능한 쿠폰만 만료 처리 가능합니다."),

    // 미리 만들고 가는 영역 — Pay 패턴 일관성 (통합 단계 격차 의식적 채택)
    COUPON_EXPIRED(HttpStatus.BAD_REQUEST, "만료된 쿠폰입니다."),
    COUPON_ALREADY_USED(HttpStatus.CONFLICT, "이미 사용된 쿠폰입니다.");

    private final HttpStatus status;
    private final String msg;
}
