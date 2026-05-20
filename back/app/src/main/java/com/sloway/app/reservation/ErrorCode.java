package com.sloway.app.reservation;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum ErrorCode {

    MEMBER_NOT_FOUND(404, "회원을 찾을 수 없습니다."),
    PLACE_NOT_FOUND(404, "공간을 찾을 수 없습니다."),
    RESERVATION_NOT_FOUND(404, "해당 예약을 찾을 수 없습니다."),
    BLACKOUT_NOT_FOUND(404, "해당 이용불가 설정을 찾을 수 없습니다."),
    ALREADY_CANCELLED(400, "이미 취소된 예약입니다."),
    BLACKOUT_CONFLICT(400, "이미 예약 불가 설정된 기간입니다."),
    INVALID_DATE_RANGE(400, "체크아웃 날짜는 체크인 날짜보다 이후여야 합니다."),
    UNAUTHORIZED_ACCESS(403, "해당 기능에 대한 접근권한이 없습니다.");

    private final int status;
    private final String message;
}
