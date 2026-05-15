package com.sloway.app.review.report.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ReportProcessStatus {

    I("유지"), D("삭제");

    private final String code;
}
