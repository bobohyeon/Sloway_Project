package com.sloway.app.auth.oauth;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

/**
 * 카카오 OAuth API 직접 호출 클라이언트.
 * code → 토큰 교환, 토큰 → 사용자 정보 조회.
 */
@Slf4j
@Component
public class KakaoOAuthClient {

    @Value("${kakao.client-id}")
    private String clientId;

    @Value("${kakao.redirect-uri}")
    private String redirectUri;

    private static final String TOKEN_URL = "https://kauth.kakao.com/oauth/token";
    private static final String USER_INFO_URL = "https://kapi.kakao.com/v2/user/me";

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * 1) 인가 코드(code)로 카카오 액세스 토큰 받기.
     */
    public String getAccessToken(String code) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", clientId);
        params.add("redirect_uri", redirectUri);
        params.add("code", code);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        try {
            ResponseEntity<Map> response =
                    restTemplate.postForEntity(TOKEN_URL, request, Map.class);
            Object token = response.getBody().get("access_token");
            if (token == null) {
                throw new IllegalStateException("카카오 액세스 토큰 응답에 access_token 없음");
            }
            return token.toString();
        } catch (Exception e) {
            log.error("카카오 토큰 교환 실패", e);
            throw new IllegalStateException("카카오 인증에 실패했습니다");
        }
    }

    /**
     * 2) 카카오 액세스 토큰으로 사용자 정보 조회.
     * @return KakaoUserInfo (소셜 고유 id, 이메일, 닉네임)
     */
    public KakaoUserInfo getUserInfo(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        try {
            ResponseEntity<Map> response =
                    restTemplate.exchange(USER_INFO_URL, HttpMethod.GET, request, Map.class);
            Map body = response.getBody();

            // 카카오 응답 구조: { id, kakao_account: { email, profile: { nickname } } }
            String providerUserId = String.valueOf(body.get("id"));

            Map kakaoAccount = (Map) body.get("kakao_account");
            String email = kakaoAccount != null ? (String) kakaoAccount.get("email") : null;

            String nickname = null;
            if (kakaoAccount != null) {
                Map profile = (Map) kakaoAccount.get("profile");
                if (profile != null) {
                    nickname = (String) profile.get("nickname");
                }
            }

            return new KakaoUserInfo(providerUserId, email, nickname);
        } catch (Exception e) {
            log.error("카카오 사용자 정보 조회 실패", e);
            throw new IllegalStateException("카카오 사용자 정보를 가져오지 못했습니다");
        }
    }
}