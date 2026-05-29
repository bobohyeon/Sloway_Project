package com.sloway.app.host.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 호스트 마이페이지 수정 요청.
 *
 * <p>회원 공통 정보 + 사업자 정보 일부를 수정.
 * 이메일/사업자번호/사업자서류는 별도 인증 흐름이라 본 API에서 변경 불가.
 *
 * <p>모든 필드 nullable — 부분 수정 지원 (PATCH).
 */
@Getter
@Setter
@NoArgsConstructor
public class UpdateHostRequestDto {

    // ─── 회원 공통 정보 ─────────────────────
    /** 이름 (null이면 변경 안 함) */
    private String name;

    /** 전화번호 (null이면 변경 안 함) */
    private String phone;

    /** 프로필 이미지 URL (null이면 변경 안 함, 빈 문자열이면 제거) */
    private String imgUrl;

    // ─── 사업자 정보 ───────────────────────
    /** 상호명 (null이면 변경 안 함) */
    private String businessName;
}