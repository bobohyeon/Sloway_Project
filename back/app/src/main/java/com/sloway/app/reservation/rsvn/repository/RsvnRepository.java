package com.sloway.app.reservation.rsvn.repository;

import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.reservation.rsvn.entity.RsvnEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RsvnRepository extends JpaRepository<RsvnEntity, Long> {

    //내 예약 목록 조회
    List<RsvnEntity> findByMemberNo(MemberEntity memberNo);

    //내 예약 상세 조회
    Optional<RsvnEntity> findByNoAndMemberNo(Long no, MemberEntity memberNo);
}