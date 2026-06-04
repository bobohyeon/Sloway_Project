package com.sloway.app.auth.controller;

import com.sloway.app.auth.dto.request.*;
import com.sloway.app.auth.dto.response.EmailCheckResponseDto;
import com.sloway.app.auth.dto.response.FindEmailResponseDto;
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

    /**
     * 비밀번호 찾기(재설정). 비로그인 상태에서 호출.
     *
     * <p>흐름: 이메일 인증코드 발송(send-code) → 확인(verify-code) → 본 API로 새 비번 설정.
     * 서버가 isVerified로 인증 완료를 재검증한 뒤에만 비번을 바꾼다.
     */
    @PostMapping("/password/reset")
    public ResponseEntity<Void> resetPassword(@RequestBody ResetPasswordRequestDto request) {
        log.info("비밀번호 재설정 요청: email={}", request.getEmail());
        authService.resetPassword(request);
        return ResponseEntity.ok().build();
    }
    /**
     * 아이디(이메일) 찾기.
     * 이름 + 전화번호로 가입된 이메일을 마스킹하여 안내.
     * 비로그인 상태에서 호출 (permitAll).
     */
    @PostMapping("/find-email")
    public ResponseEntity<FindEmailResponseDto> findEmail(
            @RequestBody FindEmailRequestDto request) {
        return ResponseEntity.ok(authService.findEmail(request));
    }

}//class
