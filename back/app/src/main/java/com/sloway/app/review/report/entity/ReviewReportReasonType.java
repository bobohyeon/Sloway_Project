package com.sloway.app.review.report.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ReviewReportReasonType {

    SPAM("공간과 관련 없는 내용"),
    FALSE("허위 또는 과장된 내용"),
    PRIVACY("개인정보 노출"),
    HATE("욕설·혐오 표현"),
    COPYRIGHT("저작권 침해"),
    ETC("기타");

    private final String code;
}
