package com.sloway.app.member.common;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 일반회원 인증 방식
 *
 * <ul>
 *   <li>L — LOCAL  (이메일·비밀번호 가입)</li>
 *   <li>K — KAKAO  (카카오 OAuth)</li>
 *   <li>G — GOOGLE (구글 OAuth)</li>
 * </ul>
 *
 * DB 저장: VARCHAR(1)
 */
@Getter
@RequiredArgsConstructor
public enum AuthType {

    L("LOCAL"),
    K("KAKAO"),
    G("GOOGLE");

    private final String code;
}