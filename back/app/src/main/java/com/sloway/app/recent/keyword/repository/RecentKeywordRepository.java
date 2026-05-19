package com.sloway.app.recent.keyword.repository;

import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.recent.keyword.entity.RecentKeywordEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecentKeywordRepository extends JpaRepository<RecentKeywordEntity, Long> {

    // 본인 검색어 목록 조회
    List<RecentKeywordEntity> findByMemberNoOrderBySearchedAtDesc(MemberEntity memberNo);

    // 본인 검색어 개수 조회
    Long countByMemberNo(MemberEntity memberNo);

    // 가장 오래된 검색어 조회 (후 삭제. service에서)
    List<RecentKeywordEntity> findTop1ByMemberNoOrderBySearchedAtAsc(MemberEntity memberNo);

    //개별 삭제 메서드
    void deleteByNoAndMemberNo(Long no, MemberEntity memberNo);

    //전체 삭제 메서드
    void deleteByMemberNo(MemberEntity memberNo);

    //중복 확인
    boolean existsByMemberNoAndKeyword(MemberEntity memberNo, String keyword);

    //중복되었으면 삭제
    void deleteByMemberNoAndKeyword(MemberEntity member, String keyword);
}
