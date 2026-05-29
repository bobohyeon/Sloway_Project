package com.sloway.app.admin.controller;

import com.sloway.app.admin.dto.request.UpdateAdminRequestDto;
import com.sloway.app.admin.dto.response.AdminMyPageResponseDto;
import com.sloway.app.admin.service.AdminService;
import com.sloway.app.auth.user.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * 어드민 — 본인 영역 API.
 *
 * <p>URL: /api/admin/me/**
 * 권한: ROLE_ADMIN (SecurityConfig의 /api/admin/** 패턴으로 보호)
 *
 * <h3>제공 기능 (단계별 추가)</h3>
 * <ul>
 *   <li>GET    /        — 본인 정보 조회 ✅ D3</li>
 *   <li>PATCH  /        — 본인 정보 수정 (D5)</li>
 *   <li>PATCH  /password — 비밀번호 변경 (D5)</li>
 * </ul>
 *
 * <p>어드민은 탈퇴 개념 없음 — DELETE 안 만듦.
 */
@RestController
@RequestMapping("/api/admin/mypage")
@RequiredArgsConstructor
@Slf4j

public class AdminMyPageController {
    private final AdminService adminService;

    @GetMapping
    public ResponseEntity<AdminMyPageResponseDto> getMyInfo(@AuthenticationPrincipal CustomUserDetails admin){
        log.info("어드민 본인 정보 조회 : adminNo={}" , admin.getMemberNo());
        AdminMyPageResponseDto result = adminService.getMyInfo(admin.getMemberNo());
        return ResponseEntity.ok(result);
    }
    @PatchMapping
    public ResponseEntity<AdminMyPageResponseDto> update(
            @RequestBody UpdateAdminRequestDto request,
            @AuthenticationPrincipal CustomUserDetails admin) {

        log.info("어드민 본인 정보 수정: adminNo={}", admin.getMemberNo());
        AdminMyPageResponseDto result = adminService.update(admin.getMemberNo(), request);
        return ResponseEntity.ok(result);
    }
}
