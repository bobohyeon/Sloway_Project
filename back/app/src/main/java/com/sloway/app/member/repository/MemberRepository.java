package com.sloway.app.member.repository;

import com.sloway.app.member.entity.MemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * 회원 공통 정보 Repository.
 *
 * <p>JpaRepository → 기본 CRUD 자동 제공.
 * MemberRepositoryCustom → 복잡 쿼리 확장 지점 (팀 공통 패턴).
 */
public interface MemberRepository extends JpaRepository<MemberEntity  , Long> , MemberRepositoryCustom {
    /**
     * 이메일로 회원 조회 (로그인·중복체크용).
     * 메서드 이름 규칙으로 쿼리 자동 생성. Optional로 부재 표현 → NPE 방지.
     */
    Optional<MemberEntity> findByEmail(String email);

    /** 이메일 존재 여부 (회원가입 중복 체크용) */
    boolean existsByEmail(String email);

}
