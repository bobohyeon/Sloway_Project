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

    /** 휴대폰번호 (하이픈 없이 11자: '01012345678') */
    @Column(length = 11, nullable = false)
    private String phone;

    /** 생년월일 (YYYYMMDD 8자) */
    @Column(length = 8)
    private String birthDate;

    /** 프로필 이미지 URL */
    @Column(length = 200)
    private String imgUrl;

    @Enumerated(EnumType.STRING)
    @Column(length = 1, nullable = false)
    private MemberStatus status;

    /** 이메일 인증 시각 (NULL = 미인증) */
    private LocalDateTime verifiedAt;

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
}