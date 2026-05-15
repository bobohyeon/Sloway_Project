package com.sloway.app.member.common;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 회원 상태
 *
 * <ul>
 *   <li>A — ACTIVE     (활성, 정상 사용)</li>
 *   <li>S — SUSPENDED  (기간 정지, 관리자 처분)</li>
 *   <li>B — BANNED     (영구 정지, 해제 불가)</li>
 *   <li>W — WITHDRAWN  (탈퇴, DEL_YN='Y'와 동기화)</li>
 * </ul>
 *
 * DB 저장: VARCHAR(1)
 */
@Getter
@RequiredArgsConstructor
public enum MemberStatus {

    A("ACTIVE"),
    S("SUSPENDED"),
    B("BANNED"),
    W("WITHDRAWN");

    private final String code;
}