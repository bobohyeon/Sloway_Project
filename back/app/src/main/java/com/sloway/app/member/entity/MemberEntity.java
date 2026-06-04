package com.sloway.app.member.entity;

import com.sloway.app.common.entity.BaseEntity;
import com.sloway.app.member.common.MemberStatus;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 회원 공통 정보 (일반회원·호스트의 부모)
 *
 * <p>다른 도메인에서 회원을 참조할 때 이 Entity의 PK(no)를 FK로 사용.
 * USER·HOST는 1:1로 연장. 관리자(Admin)는 완전 분리.
 */
@Entity
@Table(name = "MEMBER")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class MemberEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @Column(length = 100, nullable = false, unique = true)
    private String email;

    @Column(length = 100, nullable = false)
    private String name;

    /**
     * 휴대폰번호 (하이픈 없이 11자: '01012345678')
     */
    @Column(length = 13, nullable = false)
    private String phone;

    /**
     * 생년월일 (YYYYMMDD 8자)
     */
    @Column(length = 8)
    private String birthDate;

    /**
     * 프로필 이미지 URL
     */
    @Column(length = 500)
    private String imgUrl;

    @Enumerated(EnumType.STRING)
    @Column(length = 1, nullable = false)
    private MemberStatus status;

    /**
     * 이메일 인증 시각 (NULL = 미인증)
     */
    private LocalDateTime verifiedAt;

    /**
     * 정지 사유 (status=S/B 일 때 채워짐)
     */
    @Column(length = 500)
    private String suspendReason;

    /**
     * 정지 해제 시각 (NULL = 영구 또는 정지 아님).
     * <p>이 시각이 지나면 자동 해제 (배치 또는 로그인 시 검사 — 본 프로젝트는 어드민 수동 해제).
     */
    private LocalDateTime suspendUntil;

    // ─── 비즈니스 메서드 ───────────────────────────
    public void changeStatus(MemberStatus status) {
        this.status = status;
    }

    public void changePhone(String phone) {
        this.phone = phone;
    }

    public void changeName(String name) {
        this.name = name;
    }

    public void changeImgUrl(String imgUrl) {
        this.imgUrl = imgUrl;
    }

    public void verifyEmail() {
        this.verifiedAt = LocalDateTime.now();
    }

    public void suspend(String reason, LocalDateTime until) {
        this.status = (until == null) ? MemberStatus.B : MemberStatus.S;
        this.suspendReason = reason;
        this.suspendUntil = until;
    }

    public void unsuspend() {
        this.status = MemberStatus.A;
        this.suspendReason = null;
        this.suspendUntil = null;
    }
    public void changeEmail(String email) {
        this.email = email;
    }

    public void updateImgUrl(String imgUrl) {
        this.imgUrl = imgUrl;
    }
}//class