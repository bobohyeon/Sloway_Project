package com.sloway.app.member.common;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * OAuth 소셜 제공사 (SocialAccount 엔티티용, Phase 9에서 사용)
 *
 * <ul>
 *   <li>K — KAKAO</li>
 *   <li>G — GOOGLE</li>
 * </ul>
 *
 * AuthType과 별도로 둔 이유: 한 회원이 여러 소셜 계정 연동 가능
 * (예: LOCAL 가입 후 카카오·구글 추가 연동).
 *
 * DB 저장: VARCHAR(1)
 */
@Getter
@RequiredArgsConstructor
public enum SocialProvider {

    K("KAKAO"),
    G("GOOGLE");

    private final String code;
}