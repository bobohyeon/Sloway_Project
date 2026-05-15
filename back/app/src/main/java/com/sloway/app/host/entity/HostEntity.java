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

    /** Member FK — 1:1 관계 */
    @Column(nullable = false, unique = true)
    private Long memberNo;

    /** 호스트 전용 비밀번호 (일반회원 비번과 별도) */
    @Column(length = 100, nullable = false)
    private String password;

    /** 상호명 */
    @Column(length = 100, nullable = false)
    private String businessName;

    /** 사업자등록번호 (하이픈 없이 10자) */
    @Column(length = 10, nullable = false, unique = true)
    private String businessNo;

    /** 사업자등록증 PDF URL */
    @Column(length = 200)
    private String businessDocUrl;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private ApprovalState approvalState;

    /** 승인 시각 (NULL = 대기 또는 반려) */
    private LocalDateTime approvedAt;

    // ─── 비즈니스 메서드 ───────────────────────────

    public void changePassword(String encodedPassword) {
        this.password = encodedPassword;
    }

    /**
     * 호스트 신청 승인.
     * approvalState를 APPROVED로 변경 + 승인 시각 기록.
     */
    public void approve() {
//        this.approvalState = ApprovalState.APPROVED;
        this.approvedAt = LocalDateTime.now();
    }

    /**
     * 호스트 신청 반려.
     */
    public void reject() {
//        this.approvalState = ApprovalState.REJECTED;
    }

    public void changeBusinessName(String businessName) {
        this.businessName = businessName;
    }
}