package com.sloway.app.reservation.blackOut.repository;

import com.sloway.app.place.entity.office.OfficeEntity;
import com.sloway.app.place.entity.station.StationEntity;
import com.sloway.app.place.entity.workStay.WorkStayEntity;
import com.sloway.app.reservation.blackOut.entity.BlackOutEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface BlackOutRepository extends JpaRepository<BlackOutEntity, Long> {

    List<BlackOutEntity> findByOfficeNo(OfficeEntity officeNo);
    List<BlackOutEntity> findByStationNo(StationEntity stationNo);
    List<BlackOutEntity> findByWorkStayNo(WorkStayEntity workStayNo);

    @Query("""
    SELECT b FROM BlackOutEntity b
    WHERE
        (
            (:officeNo IS NOT NULL AND b.officeNo = :officeNo) OR
            (:stationNo IS NOT NULL AND b.stationNo = :stationNo) OR
            (:workStayNo IS NOT NULL AND b.workStayNo = :workStayNo )
        )
        AND
        b.startDate <= :checkOut AND
        b.endDate >= :checkIn
    """)
    List<BlackOutEntity> findOverlapping(
            @Param("officeNo") OfficeEntity officeNo,
            @Param("stationNo") StationEntity stationNo,
            @Param("workStayNo") WorkStayEntity workStayNo,
            @Param("checkIn") LocalDateTime checkIn,
            @Param("checkOut") LocalDateTime checkOut);
}
