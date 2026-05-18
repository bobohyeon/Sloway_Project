package com.sloway.app.admin.repository;

import com.sloway.app.admin.entity.AdminEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * 관리자 Repository.
 *
 * <p>AdminEntity는 Member 체계와 완전 분리 (독립 테이블, 자체 email·password).
 * 그래서 일반회원·호스트와 달리 AdminRepository가 직접 email 조회 가능.
 */
public interface AdminRepository
        extends JpaRepository<AdminEntity, Long>, AdminRepositoryCustom {

    /**
     * 이메일로 관리자 조회 (관리자 로그인용).
     * 관리자는 Member 안 거치고 여기서 바로 email→비번 검증.
     */
    Optional<AdminEntity> findByEmail(String email);

    /** 이메일 존재 여부 (관리자 계정 중복 체크용) */
    boolean existsByEmail(String email);
}