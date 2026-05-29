package com.sloway.app.admin.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 어드민 본인 정보 수정 요청.
 *
 * <p>모든 필드 nullable — 부분 수정 지원 (PATCH).
 * 이메일/비밀번호는 별도 흐름.
 */
@Getter
@Setter
@NoArgsConstructor
public class UpdateAdminRequestDto {

    /** 이름 (null이면 변경 안 함) */
    private String name;

    /** 전화번호 (null이면 변경 안 함) */
    private String phone;
}