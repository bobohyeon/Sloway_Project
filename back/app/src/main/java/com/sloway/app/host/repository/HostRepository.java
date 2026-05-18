package com.sloway.app.host.repository;

import com.sloway.app.host.entity.HostEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * 호스트 Repository.
 *
 * <p>HostEntity는 MemberEntity와 memberNo로 1:1 연결.
 * 호스트 전용 비밀번호·사업자정보·승인상태(approvalState) 보유.
 */
public interface HostRepository
        extends JpaRepository<HostEntity, Long>, HostRepositoryCustom {

    /**
     * memberNo로 호스트 조회.
     * 호스트 로그인 흐름: 이메일로 Member 찾음 → memberNo로 Host 찾아 비번 검증.
     */
    Optional<HostEntity> findByMemberNo(Long memberNo);

    /** memberNo로 호스트 가입 여부 */
    boolean existsByMemberNo(Long memberNo);

    /** 사업자등록번호 중복 체크 (호스트 신청 시 필요) */
    boolean existsByBusinessNo(String businessNo);
}