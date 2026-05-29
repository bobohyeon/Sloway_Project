package com.sloway.app.auth.entity;

import com.sloway.app.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 이메일 인증 정보 (가입 전 단계).
 *
 * <p>가입 화면에서 [인증번호 발송] 시 1행 INSERT. 같은 이메일에 여러 번 발송 가능 →
 * 여러 행 존재 가능. 검증할 땐 가장 최신(만료 안 된) 행 조회.
 *
 * <p>가입 시 verified=true 인 최신 행이 있어야 가입 허용 (AuthService.userJoin에서 검사).
 *
 * <h3>흐름</h3>
 * <pre>
 *   인증번호 발송: INSERT (email, code, expiredAt=now+5m, verified=false)
 *   인증번호 확인: UPDATE verified=true (코드/만료 검증 통과 시)
 *   가입 처리:    verified=true 확인 후 가입 진행
 * </pre>
 */
@Entity
@Table(name = "EMAIL_VERIFICATION")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class EmailVerification extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    /** 인증 대상 이메일 */
    @Column(length = 100, nullable = false)
    private String email;

    /** 6자리 숫자 인증번호 */
    @Column(length = 6, nullable = false)
    private String code;

    /** 만료 시각 (생성 후 5분) */
    @Column(nullable = false)
    private LocalDateTime expiredAt;

    /** 인증 완료 여부 (true=확인 끝, false=대기) */
    @Column(nullable = false)
    private boolean verified;


    // ─── 비즈니스 메서드 ───────────────────────────

    /**
     * 인증 완료 처리.
     * <p>코드 일치 + 만료 안 됨 확인 후 호출 (검증은 Service 책임).
     */
    public void verify() {
        this.verified = true;
    }

    /**
     * 만료 여부 확인.
     */
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiredAt);
    }
}