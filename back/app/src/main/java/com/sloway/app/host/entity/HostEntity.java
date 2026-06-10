package com.sloway.app.host.entity;

import com.sloway.app.common.entity.BaseEntity;
import com.sloway.app.host.common.ApprovalState;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 호스트 (Member 1:1 연장, 일반회원 비번과 별도 비번 보유)
 *
 * <p>호스트는 일반회원과 같은 Member를 부모로 갖되, 별도 비밀번호·사업자 정보.
 * 같은 사람이 일반회원·호스트 둘 다 가입 가능 — User와 Host에 각각 행.
 */
@Entity
@Table(name = "HOST")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class HostEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    /**
     * Member FK — 1:1 관계
     */
    @Column(nullable = false, unique = true)
    private Long memberNo;

    /**
     * 호스트 전용 비밀번호 (일반회원 비번과 별도)
     */
    @Column(length = 100, nullable = false)
    private String password;

    /**
     * 상호명
     */
    @Column(length = 100, nullable = false)
    private String businessName;

    /**
     * 사업자등록번호 (하이픈 없이 10자)
     */
    @Column(length = 10, nullable = false, unique = true)
    private String businessNo;

    /**
     * 사업자등록증 PDF URL
     */
    @Column(length = 200)
    private String businessDocUrl;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private ApprovalState approvalState;

    /**
     * 승인 시각 (NULL = 대기 또는 반려)
     */
    private LocalDateTime approvedAt;

    /**
     * 반려 사유 (NULL = 반려된 적 없음) — 호스트에게 노출됨
     */
    @Column(length = 500)
    private String rejectReason;

    /** 직전 반려 사유 (NULL = 반려된 적 없음) — 재신청 후에도 보존. 어드민이 "재신청 건 + 이전 반려 사유" 식별용 */
    @Column(length = 500)
    private String lastRejectReason;

    // ─── 비즈니스 메서드 ───────────────────────────

    public void changePassword(String encodedPassword) {
        this.password = encodedPassword;
    }

    /**
     * 호스트 신청 승인.
     * approvalState를 APPROVED로 변경 + 승인 시각 기록.
     */
    public void approve() {
        this.approvalState = ApprovalState.A;
        this.approvedAt = LocalDateTime.now();
    }

    /**
     * 호스트 신청 반려.
     * * <p>대기(P) 상태였던 호스트를 반려(R)로 전환 + 반려 사유 저장.
     * * <p>사유는 호스트에게 노출되므로 의미 있는 텍스트여야 함
     * * (빈 문자열 검증은 AdminHostService에서 수행).
     * *
     */
    public void reject(String reason) {
        this.approvalState = ApprovalState.R;
//         반려 사유 저장 — 호스트가 본인 신청 현황 조회 시 확인 가능
        this.rejectReason = reason;
        //직전 사유도 동기회
        this.lastRejectReason = reason;
    }

    public void changeBusinessName(String businessName) {
        this.businessName = businessName;
    }

    /**
     * 호스트 자격 박탈. 승인 상태(A) → 취소(V) + 사유 저장.
     */
    public void revoke(String reason) {
        this.approvalState = ApprovalState.V;
        this.rejectReason = reason;   // 박탈 사유 (rejectReason 재활용)
    }

    /**
     * 호스트 자격 복구. 박탈(V) → 승인(A)으로 되돌림 + 박탈 사유 초기화.
     */
    public void restore() {
        this.approvalState = ApprovalState.A;
        this.rejectReason = null;
    }

    /**
     * 호스트 신청 재검토. 반려(R) → 대기(P)로 되돌림 + 반려 사유 초기화.
     * <p>
     * 반려된 신청을 다시 심사대에 올린다. 사유를 비우는 이유:
     * P(대기)인데 옛 반려 사유가 남아 있으면 "대기 중인데 반려 사유가 보이는"
     * 모순이 생기기 때문. 재심사 후 다시 문제가 있으면 reject(reason)가 새 사유로 다시 채운다.
     */
    public void reReview() {
        this.lastRejectReason = this.rejectReason;
        this.approvalState = ApprovalState.P;
        this.rejectReason = null;
    }

    /**
     * 사업자등록번호 변경 (재신청 시).
     */
    public void changeBusinessNo(String businessNo) {
        this.businessNo = businessNo;
    }

    /**
     * 사업자등록증 파일 교체 (재신청 시).
     */
    public void changeBusinessDocUrl(String businessDocUrl) {
        this.businessDocUrl = businessDocUrl;
    }
}//class