package com.sloway.app.auth.oauth;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

/**
 * 카카오 OAuth 콜백 컨트롤러.
 *
 * <p>흐름: 카카오 인증 후 code가 이 콜백으로 옴 → 서비스가 로그인 처리 → JWT 발급
 * → 프론트 콜백 페이지로 리다이렉트하며 토큰 전달.
 */
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth/oauth/kakao")
public class KakaoOAuthController {

    private final KakaoOAuthService kakaoOAuthService;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    /**
     * 카카오 로그인 콜백.
     * 카카오 콘솔에 등록한 Redirect URI와 일치해야 함:
     * http://localhost:8080/api/auth/oauth/kakao/callback
     */
    @GetMapping("/callback")
    public RedirectView callback(@RequestParam("code") String code) {
        try {
            String accessToken = kakaoOAuthService.login(code);

            // 일반 로그인과 형식 통일 — "Bearer " 접두사 포함
            String redirect = frontendUrl + "/oauth/callback/kakao?token="
                    + URLEncoder.encode("Bearer " + accessToken, StandardCharsets.UTF_8);
            return new RedirectView(redirect);

        } catch (Exception e) {
            log.error("카카오 로그인 실패", e);
            // 실패 시 프론트 로그인 페이지로 에러 표시
            String redirect = frontendUrl + "/oauth/callback/kakao?error="
                    + URLEncoder.encode("kakao_login_failed", StandardCharsets.UTF_8);
            return new RedirectView(redirect);
    }
    }
}