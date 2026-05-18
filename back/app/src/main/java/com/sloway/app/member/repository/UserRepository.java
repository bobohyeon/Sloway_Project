package com.sloway.app.member.repository;

import com.sloway.app.member.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * 일반회원 Repository.
 *
 * <p>UserEntity는 MemberEntity와 memberNo로 1:1 연결.
 * 로그인 시 memberNo로 UserEntity 찾아 비밀번호·인증방식 확인.
 */
public interface UserRepository extends JpaRepository<UserEntity, Long>, UserRepositoryCustom {

    /**
     * memberNo로 일반회원 조회.
     * 로그인 흐름: 이메일로 Member 찾음 → 그 memberNo로 User 찾아 비번 검증.
     */

    Optional<UserEntity>  findByMemberNo(Long memberNo);

    /** memberNo로 일반회원 가입 여부 (한 사람이 일반/호스트 중복가입 가능) */
    boolean existsByMemberNo(Long memberNo);

}
