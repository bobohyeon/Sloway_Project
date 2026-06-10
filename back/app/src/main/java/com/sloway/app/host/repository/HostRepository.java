package com.sloway.app.host.repository;

import com.sloway.app.host.common.ApprovalState;
import com.sloway.app.host.entity.HostEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Set;

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

    /**
     * memberNo로 호스트 가입 여부
     */
    boolean existsByMemberNo(Long memberNo);

    /**
     * 사업자등록번호 중복 체크 (호스트 신청 시 필요)
     */
    boolean existsByBusinessNo(String businessNo);

    /**
     * 사업자등록번호 중복 체크 — 본인(memberNo) 제외.
     * 재신청 시 자기 기존 번호엔 안 걸리고, 다른 호스트가 쓰는 번호만 막기 위함.
     */
    boolean existsByBusinessNoAndMemberNoNot(String businessNo, Long memberNo);

    /**
     * 상태 필터 + 페이징 조회.
     * <p>어드민 호스트 목록에서 "대기/승인/반려/취소" 필터링용.
     */
    Page<HostEntity> findByApprovalState(ApprovalState state, PageRequest pageable);

    @Query("SELECT h.memberNo FROM HostEntity h WHERE h.memberNo IN :memberNos")
    Set<Long> findMemberNosByMemberNoIn(@Param("memberNos") List<Long> memberNos);

}