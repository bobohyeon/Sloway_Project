package com.sloway.app.reservation.rsvn.repository;

import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.place.entity.office.OfficeEntity;
import com.sloway.app.place.entity.station.StationEntity;
import com.sloway.app.place.entity.workStay.WorkStayEntity;
import com.sloway.app.reservation.rsvn.entity.RsvnEntity;
import com.sloway.app.reservation.rsvn.entity.RsvnStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RsvnRepository extends JpaRepository<RsvnEntity, Long> {

    //내 예약 목록 조회
    List<RsvnEntity> findByMemberNo(MemberEntity memberNo);

    //내 예약 상세 조회
    Optional<RsvnEntity> findByNoAndMemberNo(Long no, MemberEntity memberNo);

    //호스트 공간별 예약 조회
    List<RsvnEntity> findByOfficeNoIn(List<OfficeEntity> offices);
    List<RsvnEntity> findByStationNoIn(List<StationEntity> stations);
    List<RsvnEntity> findByWorkStayNoIn(List<WorkStayEntity> workStays);

    //이용완료 목록 조회
    List<RsvnEntity> findByMemberNoAndStatus(MemberEntity memberNo, RsvnStatus status);
}