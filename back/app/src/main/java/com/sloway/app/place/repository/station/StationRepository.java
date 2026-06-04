package com.sloway.app.place.repository.station;

import com.sloway.app.place.entity.station.StationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface StationRepository extends JpaRepository<StationEntity, Long>, StationRepositoryCustom {
    @Query("SELECT s FROM StationEntity s WHERE s.placeEntity.no = :placeNo")
    Optional<StationEntity> findByPlaceNo(@Param("placeNo") Long placeNo);
}
