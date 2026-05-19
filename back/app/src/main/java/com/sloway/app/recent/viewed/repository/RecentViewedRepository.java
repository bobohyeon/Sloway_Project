package com.sloway.app.recent.viewed.repository;

import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.place.entity.place.PlaceEntity;
import com.sloway.app.recent.viewed.entity.RecentViewedEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecentViewedRepository extends JpaRepository<RecentViewedEntity, Long> {

    // 최근 본 공간 목록 조회
    List<RecentViewedEntity> findByMemberNoOrderByViewAtDesc(MemberEntity memberNo);

    // 최근 본 공간 목록 갯수 조회
    Long countByMemberNo(MemberEntity memberNo);

    // 최근 본 공간 목록 중 가장 오래된 것
    List<RecentViewedEntity> findTop1ByMemberNoOrderByViewAtAsc(MemberEntity memberNo);

    // 최근 본 공간 목록 단건 삭제
    void deleteByNoAndMemberNo(Long no, MemberEntity memberNo);

    // 최근 본 공간 목록 전체 삭제
    void deleteByMemberNo(MemberEntity memberNo);

    // 최근 본 공간 중복 확인
    boolean existsByMemberNoAndPlaceNo(MemberEntity memberNo, PlaceEntity placeNo);

    // 중복되었으면 삭제
    void deleteByMemberNoAndPlaceNo(MemberEntity memberNo, PlaceEntity placeNo);

}
