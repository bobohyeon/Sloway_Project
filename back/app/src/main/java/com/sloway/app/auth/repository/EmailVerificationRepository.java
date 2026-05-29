package com.sloway.app.auth.repository;

import com.sloway.app.auth.entity.EmailVerification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * 이메일 인증 정보 Repository.
 *
 * <p>인증 흐름의 두 시점에서 사용:
 * <ul>
 *   <li>인증번호 확인 — 이메일+코드로 미인증 최신 행 조회</li>
 *   <li>가입 검증     — 이메일로 인증완료된 최신 행 조회</li>
 * </ul>
 */
public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Long> {

    /**
     * 인증번호 확인용 조회.
     * <p>같은 이메일에 여러 발송 이력 있을 수 있어 최신 1건만 가져옴.
     * <p>verified 조건은 Service에서 추가 검증 (이미 인증된 코드 재사용 방지).
     */
    Optional<EmailVerification> findFirstByEmailAndCodeOrderByNoDesc(String email, String code);

    /**
     * 가입 시점 인증 여부 검증용.
     * <p>이메일에 verified=true인 최신 행 존재 여부.
     */
    Optional<EmailVerification> findFirstByEmailAndVerifiedTrueOrderByNoDesc(String email);
}