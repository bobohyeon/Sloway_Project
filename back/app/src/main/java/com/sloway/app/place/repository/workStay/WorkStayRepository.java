package com.sloway.app.place.repository.workStay;

import com.sloway.app.place.entity.workStay.WorkStayEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface WorkStayRepository extends JpaRepository<WorkStayEntity, Long>, WorkStayRepositoryCustom {
    @Query("SELECT w FROM WorkStayEntity w WHERE w.placeEntity.no = :placeNo")
    Optional<WorkStayEntity> findByPlaceNo(@Param("placeNo") Long placeNo);
}
