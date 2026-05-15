package com.sloway.app.member.entity;

import com.sloway.app.common.entity.BaseEntity;
import com.sloway.app.member.common.AuthType;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 일반회원 (Member 1:1 연장)
 *
 * <p>일반회원 전용 정보 — 비밀번호·인증 방식.
 * 같은 사람이 호스트로도 가입 가능 (User와 Host에 각각 행, 같은 memberNo).
 */
@Entity
@Table(name = "USERS")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class UserEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    /** Member FK — 1:1 관계 */
    @Column(nullable = false, unique = true)
    private Long memberNo;

    /**
     * BCrypt 암호화된 비밀번호 (해시 60자).
     * OAuth 가입자(authType != LOCAL)는 NULL.
     */
    @Column(length = 100)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private AuthType authType;

    // ─── 비즈니스 메서드 ───────────────────────────

    /**
     * 비밀번호 변경. BCrypt 암호화된 값으로 호출해야 함.
     */
    public void changePassword(String encodedPassword) {
        this.password = encodedPassword;
    }
}