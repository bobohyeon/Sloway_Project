package com.sloway.app.member.controller;

import com.sloway.app.auth.dto.request.ChangePasswordRequestDto;
import com.sloway.app.auth.user.CustomUserDetails;
import com.sloway.app.member.dto.request.ChangeEmailRequestDto;
import com.sloway.app.member.dto.request.UpdateUserRequestDto;
import com.sloway.app.member.dto.response.SocialAccountResponseDto;
import com.sloway.app.member.dto.response.UserResponseDto;
import com.sloway.app.member.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 일반회원 — 본인 영역 API.
 *
 * <p>URL: /api/user/mypage/**
 * 권한: ROLE_USER (SecurityConfig의 /api/user/** 패턴으로 보호)
 *
 * <h3>제공 기능 (단계별 추가)</h3>
 * <ul>
 *   <li>GET    /          — 마이페이지 조회 ✅ D0</li>
 *   <li>PATCH  /          — 마이페이지 수정 (이름·전화·프로필) ✅ D5</li>
 *   <li>PATCH  /password  — 비밀번호 변경 (D5 후순위)</li>
 *   <li>DELETE /          — 회원 탈퇴 (D6)</li>
 * </ul>
 *
 * <p>이메일 변경은 D6 이메일 인증 도입 후 별도 처리.
 */
@Slf4j
@RestController
@RequestMapping("/api/user/mypage")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<UserResponseDto> getUserProfile(@AuthenticationPrincipal CustomUserDetails userDetails){
        log.info("마이페이지 조회 성공~Authenticated user"  + userDetails.getEmail());
        UserResponseDto myInfo = userService.getMyInfo(userDetails.getMemberNo());

        return ResponseEntity.ok(myInfo);
    }

//일반회원 마이페이지 수정
    @PatchMapping
    public ResponseEntity<UserResponseDto> update(
            @RequestPart("dto") UpdateUserRequestDto request,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage,
            @AuthenticationPrincipal CustomUserDetails user) {

        log.info("일반회원 마이페이지 수정: memberNo={}", user.getMemberNo());
        UserResponseDto result = userService.update(user.getMemberNo(), request, profileImage);
        return ResponseEntity.ok(result);
    }

    /**
     * 일반회원 비밀번호 변경.
     *
     * <p>현재 비밀번호 검증 후 새 비밀번호로 교체.
     * <p>변경 후 FE에서 토큰 폐기 + 재로그인 안내 (백엔드는 비번만 변경).
     */
    @PatchMapping("/password")
    public ResponseEntity<Void> changePassword(
            @RequestBody ChangePasswordRequestDto request,
            @AuthenticationPrincipal CustomUserDetails user) {

        log.info("일반회원 비밀번호 변경: memberNo={}", user.getMemberNo());
        userService.changePassword(user.getMemberNo(), request);
        return ResponseEntity.ok().build();
    }
    /**
     * 일반회원 이메일 변경.
     */
    @PatchMapping("/email")
    public ResponseEntity<Void> changeEmail(
            @RequestBody ChangeEmailRequestDto request,
            @AuthenticationPrincipal CustomUserDetails user) {

        log.info("일반회원 이메일 변경: memberNo={}", user.getMemberNo());
        userService.changeEmail(user.getMemberNo(), request);
        return ResponseEntity.ok().build();
    }

    /**
     * 내 연동 소셜 계정 목록. GET /api/user/social-accounts
     */
    @GetMapping("/social-accounts")
    public ResponseEntity<List<SocialAccountResponseDto>> getSocialAccounts(
            @AuthenticationPrincipal CustomUserDetails user) {
        List<SocialAccountResponseDto> accounts =
                userService.getSocialAccounts(user.getMemberNo());
        return ResponseEntity.ok(accounts);
    }

}
