package com.sloway.app.admin.controller;

import com.sloway.app.admin.dto.request.SuspendRequestDto;
import com.sloway.app.admin.dto.response.MemberDetailResponseDto;
import com.sloway.app.admin.dto.response.MemberListResponseDto;
import com.sloway.app.admin.service.AdminMemberService;
import com.sloway.app.auth.user.CustomUserDetails;
import com.sloway.app.member.common.MemberStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * 어드민 — 회원 관리 API.
 *
 * <p>URL: /api/admin/members/**
 * 권한: ROLE_ADMIN (SecurityConfig의 /api/admin/** 패턴으로 보호)
 *
 * <h3>제공 기능</h3>
 * <ul>
 *   <li>GET  /                      — 회원 목록 조회 (페이징 + 상태 필터) ✅ D4</li>
 *   <li>GET  /{id}                  — 회원 상세 조회 ✅ D4</li>
 *   <li>POST /{id}/suspend          — 회원 정지 (사유 + 기간 필수) ✅ D4</li>
 *   <li>POST /{id}/unsuspend        — 회원 정지 해제 (시간 남으면)</li>
 * </ul>
 *
 * <p>{id}는 MemberEntity.no (회원 PK).
 */

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/admin/members")
@RestController
public class AdminMemberController {

    private final AdminMemberService adminMemberService;

    //회원 목록 조회
    @GetMapping
    public ResponseEntity<Page<MemberListResponseDto>> findAll(
            @RequestParam(required = false) MemberStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        log.info("회원 목록 조회: status={}, page={}, size={}", status, page, size);
        Page<MemberListResponseDto> result = adminMemberService.findAll(status, page, size);
        return ResponseEntity.ok(result);
    }

    //회원 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<MemberDetailResponseDto> findOne(@PathVariable Long id) {
        log.info("회원 상세 조회: memberNo={}", id);
        MemberDetailResponseDto result = adminMemberService.findOne(id);
        return ResponseEntity.ok(result);
    }

    //회원 정지
    @PostMapping("/{id}/suspend")
    public ResponseEntity<Void> suspend(
            @PathVariable Long id,
            @RequestBody SuspendRequestDto request,
            @AuthenticationPrincipal CustomUserDetails admin) {

        log.info("회원 정지 요청: memberNo={}, days={}, adminNo={}",
                id, request.getDays(), admin.getMemberNo());
        adminMemberService.suspend(id, request.getReason(), request.getDays());
        return ResponseEntity.ok().build();
    }

    //회원 정지 해제
    @PostMapping("/{id}/unsuspend")
    public ResponseEntity<Void> unsuspend(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails admin) {

        log.info("회원 정지 해제 요청: memberNo={}, adminNo={}", id, admin.getMemberNo());
        adminMemberService.unsuspend(id);
        return ResponseEntity.ok().build();
    }

}//class
