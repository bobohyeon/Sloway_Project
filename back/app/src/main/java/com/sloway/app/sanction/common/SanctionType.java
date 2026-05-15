package com.sloway.app.sanction.common;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 회원 제재 유형
 *
 * <ul>
 *   <li>S — SUSPENDED (기간 정지, ended_at에 종료 시각 기록)</li>
 *   <li>B — BANNED    (영구 정지, ended_at은 NULL)</li>
 * </ul>
 *
 * DB 저장: VARCHAR(1)
 */
@Getter
@RequiredArgsConstructor
public enum SanctionType {

    S("SUSPENDED"),
    B("BANNED");

    private final String code;
}