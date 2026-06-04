package com.sloway.app.host.controller;

import com.sloway.app.auth.dto.request.ChangePasswordRequestDto;
import com.sloway.app.auth.user.CustomUserDetails;
import com.sloway.app.host.dto.request.UpdateHostRequestDto;
import com.sloway.app.host.dto.response.HostApplicationResponseDto;
import com.sloway.app.host.dto.response.HostMyPageResponseDto;
import com.sloway.app.host.service.HostService;
import com.sloway.app.member.dto.request.ChangeEmailRequestDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * 호스트 — 본인 영역 API.
 *
 * <p>URL: /api/host/mypage/**
 * 권한: ROLE_HOST (SecurityConfig의 /api/host/** 패턴으로 보호)
 *
 * <h3>제공 기능 (단계별 추가)</h3>
 * <ul>
 *   <li>GET  /          — 마이페이지 조회 (회원+사업자 정보) ✅ D3</li>
 *   <li>GET  /application — 본인 신청 현황 (상태/사유) (D3 블록 2)</li>
 *   <li>PATCH /         — 마이페이지 수정 (D5)</li>
 *   <li>PATCH /password — 비밀번호 변경 (D5)</li>
 *   <li>DELETE /        — 회원 탈퇴 (D6)</li>
 * </ul>
 */

@RestController
@RequestMapping("api/host/mypage")
@RequiredArgsConstructor
@Slf4j
public class HostController {
    private final HostService hostService;


    /**
     * 호스트 마이페이지 조회.
     * <p>토큰의 memberNo로 본인 정보(회원+사업자) 조회.
     *
     * @return
     */

    @GetMapping
    public ResponseEntity<HostMyPageResponseDto> hostMyInfo(@AuthenticationPrincipal CustomUserDetails host){
        log.info("호스트 마이페이지 조회 member={}",host.getMemberNo());
        HostMyPageResponseDto hostMyPageResponseDto = hostService.hostMyInfo(host.getMemberNo());
        return ResponseEntity.ok(hostMyPageResponseDto);
    }

    //호스트 마이페이지 수정
    @PatchMapping
    public ResponseEntity<HostMyPageResponseDto> update(
            @RequestPart("dto") UpdateHostRequestDto request,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage,
            @AuthenticationPrincipal CustomUserDetails host) {

        log.info("호스트 마이페이지 수정: memberNo={}", host.getMemberNo());
        HostMyPageResponseDto result = hostService.update(host.getMemberNo(), request, profileImage);
        return ResponseEntity.ok(result);
    }
    /**
     * 호스트 비밀번호 변경.
     *
     * <p>비밀번호는 HostEntity에 저장됨 (Member 아님).
     * 호스트는 일반회원과 별도 비번 — 같은 사람이 두 도메인 가입 가능 구조.
     */
    @PatchMapping("/password")
    public ResponseEntity<Void> changePassword(
            @RequestBody ChangePasswordRequestDto request,
            @AuthenticationPrincipal CustomUserDetails host) {

        log.info("호스트 비밀번호 변경: memberNo={}", host.getMemberNo());
        hostService.changePassword(host.getMemberNo(), request);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/email")
    public ResponseEntity<Void> changeEmail(
            @RequestBody ChangeEmailRequestDto request,
            @AuthenticationPrincipal CustomUserDetails host) {

        log.info("호스트 이메일 변경: memberNo={}", host.getMemberNo());
        hostService.changeEmail(host.getMemberNo(), request);
        return ResponseEntity.ok().build();
    }


    /**
     * 호스트 본인 신청 현황 조회.
     * 상태(P/A/R/V) + 반려 사유.
     */
    @GetMapping("/application")
    public ResponseEntity<HostApplicationResponseDto> myApplication(
            @AuthenticationPrincipal CustomUserDetails host) {
        log.info("호스트 신청 현황 조회: memberNo={}", host.getMemberNo());
        HostApplicationResponseDto result = hostService.getMyApplication(host.getMemberNo());
        return ResponseEntity.ok(result);
    }

    /**
     * 호스트 탈퇴. DELETE /api/host/mypage
     *
     * <p>토큰의 memberNo로 본인만 탈퇴 (soft delete). 성공 시 204.
     */
    @DeleteMapping
    public ResponseEntity<Void> withdraw(@AuthenticationPrincipal CustomUserDetails host) {
        log.info("호스트 탈퇴: memberNo={}", host.getMemberNo());
        hostService.withdraw(host.getMemberNo());
        return ResponseEntity.noContent().build();
    }
}//class
