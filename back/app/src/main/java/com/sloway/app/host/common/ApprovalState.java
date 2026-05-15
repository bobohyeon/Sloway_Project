package com.sloway.app.host.common;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 호스트 신청·자격 상태
 *
 * <ul>
 *   <li>P — PENDING  (대기, 관리자 검토 전)</li>
 *   <li>A — APPROVED (승인, 호스트 자격 보유)</li>
 *   <li>R — REJECTED (반려, 재신청 가능)</li>
 *   <li>V — REVOKED  (자격 취소, 관리자 처분으로 자격 박탈)</li>
 * </ul>
 *
 * DB 저장: VARCHAR(1)
 *
 * <h3>상태 전이</h3>
 * <pre>
 *   신청        → P
 *   관리자 승인 → A (P에서만)
 *   관리자 반려 → R (P에서만)
 *   자격 취소   → V (A에서만)
 * </pre>
 */
@Getter
@RequiredArgsConstructor
public enum ApprovalState {

    P("PENDING"),
    A("APPROVED"),
    R("REJECTED"),
    V("REVOKED");

    private final String code;
}