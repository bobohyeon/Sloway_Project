package com.sloway.app.inquiry.exception;

import com.sloway.app.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@RequiredArgsConstructor
@Getter
public enum InquiryErrorCode implements ErrorCode {

    INQUIRY_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 문의를 찾을 수 없습니다."),
    REPLY_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 답변을 찾을 수 없습니다."),
    MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND, "회원 정보를 찾을 수 없습니다."),
    ADMIN_NOT_FOUND(HttpStatus.NOT_FOUND, "관리자 정보를 찾을 수 없습니다."),
    UNAUTHORIZED(HttpStatus.FORBIDDEN, "해당 문의에 접근할 권한이 없습니다."),
    ALREADY_ANSWERED(HttpStatus.BAD_REQUEST, "이미 답변이 등록된 문의입니다."),
    CANNOT_MODIFY_ANSWERED(HttpStatus.BAD_REQUEST, "답변 완료된 문의는 수정/삭제할 수 없습니다.");

    private final HttpStatus status;
    private final String msg;
}
