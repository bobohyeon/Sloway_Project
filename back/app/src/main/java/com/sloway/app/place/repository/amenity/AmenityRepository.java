package com.sloway.app.place.repository.amenity;

import com.sloway.app.place.entity.amenity.AmenityEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AmenityRepository extends JpaRepository<AmenityEntity,Long>, AmenityRepositoryCustom {
    List<AmenityEntity> findAllByNoIn(List<Long> amenityNos);
}
