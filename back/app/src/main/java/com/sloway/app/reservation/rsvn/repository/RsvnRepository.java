package com.sloway.app.reservation.rsvn.repository;

import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.place.entity.office.OfficeEntity;
import com.sloway.app.place.entity.station.StationEntity;
import com.sloway.app.place.entity.workStay.WorkStayEntity;
import com.sloway.app.reservation.rsvn.entity.RsvnEntity;
import com.sloway.app.reservation.rsvn.entity.RsvnStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface RsvnRepository extends JpaRepository<RsvnEntity, Long> {

    //내 예약 목록 조회 (최신순)
    List<RsvnEntity> findByMemberNoOrderByCreatedAtDesc(MemberEntity memberNo);

    //내 예약 상세 조회
    Optional<RsvnEntity> findByNoAndMemberNo(Long no, MemberEntity memberNo);

    //호스트 공간별 예약 조회
    List<RsvnEntity> findByOfficeNoIn(List<OfficeEntity> offices);
    List<RsvnEntity> findByStationNoIn(List<StationEntity> stations);
    List<RsvnEntity> findByWorkStayNoIn(List<WorkStayEntity> workStays);

    //이용완료 목록 조회
    List<RsvnEntity> findByMemberNoAndStatus(MemberEntity memberNo, RsvnStatus status);

    //이용완료 스케줄러
    List<RsvnEntity> findByStatusAndCheckOutBefore(RsvnStatus status, LocalDateTime dateTime);

    //결제대기 스케줄러
    List<RsvnEntity> findByStatusAndCreatedAtBefore(RsvnStatus status, LocalDateTime dateTime);

    // 어드민 — 상태별 페이징 조회
    Page<RsvnEntity> findByStatus(RsvnStatus status, Pageable pageable);

    // 어드민 — 상태별 건수 집계 (단일 GROUP BY 쿼리)
    @Query("SELECT r.status, COUNT(r) FROM RsvnEntity r GROUP BY r.status")
    List<Object[]> countGroupByStatus();

    // 블랙아웃 등록 시 확정 예약 겹침 검증
    @Query("""
        SELECT COUNT(r) FROM RsvnEntity r
        WHERE r.status = :status
        AND (
            (:officeNo IS NOT NULL AND r.officeNo = :officeNo) OR
            (:stationNo IS NOT NULL AND r.stationNo = :stationNo) OR
            (:workStayNo IS NOT NULL AND r.workStayNo = :workStayNo)
        )
        AND r.checkIn < :endDate AND r.checkOut > :startDate
        """)
    long countOverlappingRsvn(
            @Param("officeNo") OfficeEntity officeNo,
            @Param("stationNo") StationEntity stationNo,
            @Param("workStayNo") WorkStayEntity workStayNo,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("status") RsvnStatus status);
}