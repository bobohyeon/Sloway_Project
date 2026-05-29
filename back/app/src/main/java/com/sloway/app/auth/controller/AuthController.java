package com.sloway.app.auth.controller;

import com.sloway.app.auth.dto.request.JoinRequestDto;
import com.sloway.app.auth.dto.request.SendCodeRequestDto;
import com.sloway.app.auth.dto.request.VerifyCodeRequestDto;
import com.sloway.app.auth.dto.response.EmailCheckResponseDto;
import com.sloway.app.auth.service.AuthService;
import com.sloway.app.auth.service.EmailService;
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
    private final EmailService emailService;

    @PostMapping("/join")
    public ResponseEntity<Void> userJoin(@RequestBody JoinRequestDto request) {
        authService.userJoin(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .build();
    }

    /**
     * 이메일 중복 확인 (일반회원).
     * <p>가입 화면에서 이메일 입력 시 FE가 실시간 호출.
     * URL 예: GET /api/auth/email/check?email=test@example.com
     */
    @GetMapping("/email/check")
    public ResponseEntity<EmailCheckResponseDto> checkEmail(@RequestParam String email) {

        log.info("이메일 중복확인 (일반회원): email={}", email);
        EmailCheckResponseDto result = authService.checkEmail(email);
        return ResponseEntity.ok(result);
    }

    /**
     * 이메일 인증번호 발송.
     * <p>가입 화면 → 이메일 입력 → [인증번호 발송] 버튼.
     * <p>6자리 코드를 생성해 입력된 이메일로 발송 + DB 저장 (5분 만료).
     * <p>같은 이메일에 여러 번 발송 가능 (재발송 지원).
     */
    @PostMapping("/email/send-code")
    public ResponseEntity<Void> sendCode(@RequestBody SendCodeRequestDto request) {

        log.info("이메일 인증번호 발송 요청: email={}", request.getEmail());
        emailService.sendCode(request.getEmail());
        return ResponseEntity.ok().build();
    }

    /**
     * 이메일 인증번호 확인.
     */
    @PostMapping("/email/verify-code")
    public ResponseEntity<Void> verifyCode(@RequestBody VerifyCodeRequestDto request) {

        log.info("이메일 인증번호 확인 요청: email={}", request.getEmail());
        emailService.verifyCode(request.getEmail(), request.getCode());
        return ResponseEntity.ok().build();
    }

}//class
