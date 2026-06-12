package com.sloway.app.chat.exception;

import com.sloway.app.common.exception.ErrorCode;
import org.springframework.http.HttpStatus;

public enum ChatErrorCode implements ErrorCode {
    ROOM_NOT_FOUND(HttpStatus.NOT_FOUND, "채팅방을 찾을 수 없습니다"),
    ACCESS_DENIED(HttpStatus.FORBIDDEN, "채팅방 접근 권한이 없습니다"),
    RESERVATION_NOT_FOUND(HttpStatus.NOT_FOUND, "예약 정보를 찾을 수 없습니다"),
    HOST_NOT_FOUND(HttpStatus.NOT_FOUND, "호스트 정보를 찾을 수 없습니다"),
    MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND, "회원 정보를 찾을 수 없습니다"),
    PLACE_NOT_FOUND(HttpStatus.NOT_FOUND, "공간 정보를 찾을 수 없습니다");

    private final HttpStatus status;
    private final String msg;

    ChatErrorCode(HttpStatus status, String msg) {
        this.status = status;
        this.msg = msg;
    }

    @Override
    public HttpStatus getStatus() { return status; }

    @Override
    public String getMsg() { return msg; }
}
