package com.sloway.app.reservation;

import com.sloway.app.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum RsvnErrorCode implements ErrorCode {

    MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND, "회원을 찾을 수 없습니다."),
    PLACE_NOT_FOUND(HttpStatus.NOT_FOUND, "공간을 찾을 수 없습니다."),
    RESERVATION_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 예약을 찾을 수 없습니다."),
    BLACKOUT_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 이용불가 설정을 찾을 수 없습니다."),

    RESERVATION_NOT_COMPLETED(HttpStatus.UNPROCESSABLE_CONTENT,"아직 리뷰를 쓸 수 없는 예약입니다."),

    ALREADY_CANCELLED(HttpStatus.BAD_REQUEST, "이미 취소된 예약입니다."),
    BLACKOUT_CONFLICT(HttpStatus.BAD_REQUEST, "이미 예약 불가 설정된 기간입니다."),
    INVALID_DATE_RANGE(HttpStatus.BAD_REQUEST, "체크아웃 날짜는 체크인 날짜보다 이후여야 합니다."),

    UNAUTHORIZED_ACCESS(HttpStatus.FORBIDDEN, "해당 기능에 대한 접근권한이 없습니다.");

    private final HttpStatus status;
    private final String msg;

}
