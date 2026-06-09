package com.sloway.app.member.repository;

import com.sloway.app.member.common.MemberStatus;
import com.sloway.app.member.entity.MemberEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
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

    /**
     * 이름 + 전화번호로 회원 조회 (아이디=이메일 찾기용).
     * phone은 하이픈 없이 저장되므로, 호출 전에 하이픈 제거한 값을 넘긴다.
     */
    Optional<MemberEntity> findByNameAndPhone(String name, String phone);

    /** 이메일 존재 여부 (회원가입 중복 체크용) */
    boolean existsByEmail(String email);

    /**
     * 여러 memberNo로 회원 일괄 조회 (N+1 방지).
     * <p>호스트 목록처럼 "여러 호스트의 회원 정보를 한 번에" 가져올 때 사용.
     * 빈 리스트 넘기면 빈 결과 반환 (예외 안 남).
     */
    List<MemberEntity> findByNoIn(List<Long> memberNos);

    Page<MemberEntity> findByStatus(MemberStatus status, Pageable pageable);

    @Query("SELECT m.no FROM MemberEntity m")
    List<Long> findAllMemberIds();
}
