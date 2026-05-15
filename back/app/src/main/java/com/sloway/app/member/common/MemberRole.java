package com.sloway.app.member.common;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 시스템 역할
 *
 * <ul>
 *   <li>U — USER  (일반회원)</li>
 *   <li>H — HOST  (호스트)</li>
 *   <li>A — ADMIN (관리자, Member 체계와 분리)</li>
 * </ul>
 *
 * <h3>DB 저장</h3>
 * Member 테이블엔 role 컬럼 없음. 어느 테이블(USERS/HOST/ADMIN)에
 * 속하느냐로 role 결정. JWT claim에만 사용.
 *
 * <h3>Spring Security 권한 매칭</h3>
 * {@code SimpleGrantedAuthority("ROLE_" + role.getCode())} 형태로
 * 변환. 결과 {@code "ROLE_USER"} → {@code hasRole("USER")} 매칭 ✓
 */
@Getter
@RequiredArgsConstructor
public enum MemberRole {

    U("USER"),
    H("HOST"),
    A("ADMIN");

    private final String code;
}