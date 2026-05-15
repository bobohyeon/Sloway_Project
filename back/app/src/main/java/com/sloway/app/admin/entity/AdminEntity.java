package com.sloway.app.admin.entity;

import com.sloway.app.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 관리자 (회원 체계와 완전 분리)
 *
 * <p>Member·USER·Host 테이블과 무관. 자체 로그인·자체 PK.
 * ROLE_ADMIN 권한 자동 부여.
 */
@Entity
@Table(name = "ADMIN")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class AdminEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @Column(length = 100, nullable = false, unique = true)
    private String email;

    @Column(length = 100, nullable = false)
    private String password;

    @Column(length = 100, nullable = false)
    private String name;

    /** 휴대폰번호 (하이픈 없이 11자) */
    @Column(length = 11, nullable = false)
    private String phone;

    // ─── 비즈니스 메서드 ───────────────────────────

    public void changePassword(String encodedPassword) {
        this.password = encodedPassword;
    }
}