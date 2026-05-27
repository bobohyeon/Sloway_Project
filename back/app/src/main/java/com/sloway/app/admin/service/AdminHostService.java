package com.sloway.app.admin.service;


import com.sloway.app.common.exception.CustomException;
import com.sloway.app.host.common.ApprovalState;
import com.sloway.app.host.common.HostErrorCode;
import com.sloway.app.host.entity.HostEntity;
import com.sloway.app.host.repository.HostRepository;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 어드민 — 호스트 관리 서비스.
 *
 * <p>호스트 신청의 승인/반려/자격취소 등 어드민이 호스트에 대해 수행하는
 * 모든 상태 변경 작업을 담는다.
 *
 * <h3>상태 전이 (ApprovalState)</h3>
 * <pre>
 *   P (대기)  ─ 승인 ─→ A (승인)
 *   P (대기)  ─ 반려 ─→ R (반려)
 *   A (승인)  ─ 회수 ─→ V (자격취소)   ← D4
 *   V        ─ 복원 ─→ A              ← D4
 * </pre>
 *
 * <p>모든 상태 변경은 HostEntity의 의미 메서드(approve/reject 등)에 위임.
 * Service는 "언제 호출 가능한가"(전이 규칙)만 검증.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminHostService {

    private final HostRepository hostRepository;

    /**
     * 호스트 신청 승인.
     *
     * <p>대기(P) 상태에서만 승인 가능. 이미 처리된 신청(A/R/V)이면 409 응답.
     */
    @Transactional
    public void approve(Long hostNo) {
        HostEntity host = hostRepository.findById(hostNo)
                .orElseThrow(() -> new CustomException(HostErrorCode.HOST_NOT_FOUND));

        if (host.getApprovalState() != ApprovalState.P) {
            throw new CustomException(HostErrorCode.INVALID_APPROVAL_STATE);
        }

        host.approve();
        log.info("호스트 승인 완료: hostNo={}, memberNo={}", host.getNo(), host.getMemberNo());

    }

    /**
     * 호스트 신청 반려.
     *
     * <p>대기(P) 상태에서만 반려 가능. 사유는 필수 — 호스트에게 노출됨.
     */
    @Transactional
    public void reject(Long hostNo, String reason) {
        if (reason == null || reason.isBlank()) {
            throw new CustomException(HostErrorCode.REJECT_REASON_REQUIRED);
        }

        HostEntity host = hostRepository.findById(hostNo)
                .orElseThrow(() -> new CustomException(HostErrorCode.HOST_NOT_FOUND));

        if (host.getApprovalState() != ApprovalState.P){
            throw new CustomException(HostErrorCode.INVALID_APPROVAL_STATE);
        }

        host.reject(reason);
        log.info("호스트 반려 완료: hostNo={}, memberNo={}, reason={}",
                host.getNo(), host.getMemberNo(), reason);
    }
}//class
