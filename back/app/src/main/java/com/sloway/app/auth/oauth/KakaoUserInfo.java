package com.sloway.app.auth.oauth;

import lombok.AllArgsConstructor;
import lombok.Getter;

/** 카카오에서 받아온 사용자 정보 (필요한 것만 추림) */
@Getter
@AllArgsConstructor
public class KakaoUserInfo {
    private final String providerUserId; // 카카오 고유 id
    private final String email;          // 이메일 (동의 안 했으면 null)
    private final String nickname;       // 닉네임
}