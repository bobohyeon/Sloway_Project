package com.sloway.app.place.repository.office;

import com.sloway.app.place.entity.office.OfficeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface OfficeRepository extends JpaRepository<OfficeEntity, Long>, OfficeRepositoryCustom {
    @Query("SELECT o FROM OfficeEntity o WHERE o.placeEntity.no = :placeNo")
    Optional<OfficeEntity> findByPlaceNo(@Param("placeNo") Long placeNo);
}
