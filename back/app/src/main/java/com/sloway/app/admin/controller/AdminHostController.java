package com.sloway.app.admin.controller;

import com.sloway.app.admin.dto.request.RejectRequestDto;
import com.sloway.app.admin.dto.response.HostDetailResponseDto;
import com.sloway.app.admin.dto.response.HostListResponseDto;
import com.sloway.app.admin.service.AdminHostService;
import com.sloway.app.auth.user.CustomUserDetails;
import com.sloway.app.host.common.ApprovalState;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
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

    /**
     * 어드민 — 호스트 목록 조회.
     *
     * <p>쿼리 파라미터:
     * <ul>
     *   <li>state — 상태 필터 (P/A/R/V). 생략하면 전체 조회</li>
     *   <li>page  — 페이지 번호 (0부터 시작, 기본 0)</li>
     *   <li>size  — 페이지당 개수 (기본 20)</li>
     * </ul>
     *
     * <p>예시: GET /api/admin/hosts?state=P&page=0&size=10
     *
     * @return 호스트 목록 (페이징 메타 포함)
     */
    @GetMapping
    public ResponseEntity<Page<HostListResponseDto>> findAll(
            @RequestParam(required = false) ApprovalState state,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.info("호스트 목록 조회: state={}, page={}, size={}", state, page, size);
        Page<HostListResponseDto> result = adminHostService.findAll(state, page, size);
        return ResponseEntity.ok(result);
    }

    /**
     * 어드민 — 호스트 상세 조회.
     *
     * <p>목록보다 풍부한 정보: 사업자등록증 URL, 승인/반려 시각/사유,
     * 회원 전화번호·생년월일까지 포함. 어드민이 신청 검토할 때 사용.
     *
     * @param id 호스트 PK (HostEntity.no)
     */
    @GetMapping("/{id}")
    public ResponseEntity<HostDetailResponseDto> findOne(@PathVariable Long id) {

        log.info("호스트 상세 조회: hostNo={}", id);
        HostDetailResponseDto result = adminHostService.findOne(id);
        return ResponseEntity.ok(result);
    }

    /**
     * 호스트 자격 박탈.
     * approvalState: A(승인) → V(취소) + 사유 저장.
     */
    @PostMapping("/{id}/revoke")
    public ResponseEntity<Object> revoke(@PathVariable Long id,
                                         @RequestBody RejectRequestDto dto,
                                         @AuthenticationPrincipal CustomUserDetails admin) {
        log.info("호스트 자격 박탈 요청 : hostNo={}, adminNo={}", id, admin.getMemberNo());
        adminHostService.revoke(id, dto.getReason());
        return ResponseEntity.ok().build();
    }
    /**
     * 호스트 자격 복구.
     * approvalState: V(취소) → A(승인).
     */
    @PostMapping("/{id}/restore")
    public ResponseEntity<Object> restore(@PathVariable Long id,
                                          @AuthenticationPrincipal CustomUserDetails admin) {
        log.info("호스트 자격 복구 요청 : hostNo={}, adminNo={}", id, admin.getMemberNo());
        adminHostService.restore(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/re-review")
    public ResponseEntity<Object> reReview(@PathVariable Long id,
                                           @AuthenticationPrincipal CustomUserDetails admin) {
        log.info("호스트 재검토 요청 : hostNo={}, adminNo={}", id, admin.getMemberNo());
        adminHostService.reReview(id);
        return ResponseEntity.ok().build();
    }
}//class
