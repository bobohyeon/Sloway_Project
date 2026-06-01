package com.sloway.app.auth.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 비밀번호 찾기(재설정) 요청 — 비로그인 상태.
 * 이메일 인증(isVerified) 완료 후, 이메일로 본인을 식별해 새 비번 설정.
 */
@Getter
@Setter
@NoArgsConstructor
public class ResetPasswordRequestDto {
    private String email;        // 인증 완료된 이메일
    private String newPassword;  // 새 비밀번호 (4자 이상)
}