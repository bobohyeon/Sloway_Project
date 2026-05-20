package com.sloway.app.review;

import com.sloway.app.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@RequiredArgsConstructor
@Getter
public enum ReviewErrorCode implements ErrorCode {

    REVIEW_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 리뷰를 찾을 수 없습니다."),
    REPLY_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 답글을 찾을 수 없습니다."),
    REPORT_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 신고를 찾을 수 없습니다."),
    HELPFUL_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 도움돼요를 찾을 수 없습니다."),

    ALREADY_REVIEWED(HttpStatus.BAD_REQUEST, "이미 리뷰를 작성한 예약입니다."),
    ALREADY_HELPFUL(HttpStatus.BAD_REQUEST, "이미 도움돼요를 눌렀습니다.");

    private final HttpStatus status;
    private final String msg;
}
