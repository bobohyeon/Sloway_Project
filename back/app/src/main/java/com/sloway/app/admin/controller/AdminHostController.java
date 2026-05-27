package com.sloway.app.admin.controller;

import com.sloway.app.admin.dto.request.RejectRequestDto;
import com.sloway.app.admin.service.AdminHostService;
import com.sloway.app.auth.user.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * 어드민 — 호스트 관리 API.
 *
 * <p>URL: /api/admin/hosts/**
 * 권한: ROLE_ADMIN (SecurityConfig의 /api/admin/** 패턴으로 보호)
 *
 * <h3>제공 기능 (단계별 추가)</h3>
 * <ul>
 *   <li>POST /{id}/approve — 호스트 신청 승인 (P → A) ✅ D1</li>
 *   <li>POST /{id}/reject  — 호스트 신청 반려 (P → R, 사유 필수) ✅ D1</li>
 *   <li>GET  /              — 호스트 목록 조회 (D2~D4)</li>
 *   <li>GET  /{id}          — 호스트 상세 조회 (D2)</li>
 *   <li>POST /{id}/revoke   — 호스트 자격 취소 (A → V) (D4)</li>
 *   <li>POST /{id}/restore  — 호스트 자격 복원 (V → A) (D4)</li>
 * </ul>
 *
 * <p>{id}는 HostEntity.no — 호스트 1행의 PK.
 * 어드민 식별 정보는 감사 로그용으로만 사용.
 */


@Slf4j
@RestController
@RequestMapping("/api/admin/hosts")
@RequiredArgsConstructor
public class AdminHostController {

    private final  AdminHostService adminHostService;
    /**
     * 호스트 신청 승인.
     * approvalState: P(대기) → A(승인) + approvedAt 기록.
     *
     * @return
     */
    @PostMapping("/{id}/approve")
    public ResponseEntity<Object> approve(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails admin){
        log.info("호스트 신청 승인 요청 : hostNo ={} , adminNo={}"  , id, admin.getMemberNo());
        adminHostService.approve(id);
        return ResponseEntity.ok().build();

    }
    /**
     * 호스트 신청 반려.
     * approvalState: P(대기) → R(반려) + 반려 사유 저장.
     *
     * @return
     */
    @PostMapping("/{id}/reject")
    public ResponseEntity<Object> reject(@PathVariable Long id ,
                                         @RequestBody RejectRequestDto  dto,
                                         @AuthenticationPrincipal CustomUserDetails admin){

        log.info("호스트 신청 반려 요청 : hostNo ={} , adminNp={}"  , id, admin.getMemberNo());
        adminHostService.reject(id , dto.getReason());
        return ResponseEntity.ok().build();
    }
}
