package com.sloway.app.auth.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 비밀번호 변경 요청.
 *
 * <p>일반회원/호스트/어드민 모두 공통 사용.
 * 현재 비번 검증 → 새 비번 암호화 저장.
 */
@Getter
@Setter
@NoArgsConstructor
public class ChangePasswordRequestDto {

    /** 현재 비밀번호 (BCrypt 검증 대상) */
    private String currentPassword;

    /** 새 비밀번호 (4자 이상) */
    private String newPassword;
}