package com.sloway.app.auth.controller;

import com.sloway.app.auth.dto.request.JoinRequestDto;
import com.sloway.app.auth.dto.response.EmailCheckResponseDto;
import com.sloway.app.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 인증 API — 일반회원.
 *
 * <p>로그인/로그아웃은 LoginFilter에서 처리하므로 여기엔 없음.
 * 가입·이메일인증·비번재설정 등 일반회원 인증 기능을 담는다.
 *
 * <h3>다른 도메인 담당자용 안내</h3>
 * <pre>
 * 회원가입: POST /api/auth/join
 *   body: { "email", "password", "name", "phone", "birthDate" }
 *   성공 시 201, 가입 후 POST /api/auth/login 으로 로그인 가능
 * </pre>
 */

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/join")
    public ResponseEntity<Void> userJoin(@RequestBody JoinRequestDto request) {
        authService.userJoin(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .build();
    }
    /**
     * 이메일 중복 확인 (일반회원).
     *
     * <p>가입 화면에서 이메일 입력 시 FE가 실시간 호출.
     * URL 예: GET /api/auth/email/check?email=test@example.com
     *
     * @param email 확인할 이메일 (쿼리 파라미터)
     * @return 사용 가능 여부 + 메시지
     */
    @GetMapping("/email/check")
    public ResponseEntity<EmailCheckResponseDto> checkEmail(@RequestParam String email) {

        log.info("이메일 중복확인 (일반회원): email={}", email);
        EmailCheckResponseDto result = authService.checkEmail(email);
        return ResponseEntity.ok(result);
    }
}
