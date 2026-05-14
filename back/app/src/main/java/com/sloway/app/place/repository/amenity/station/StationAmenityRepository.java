package com.sloway.app.place.repository.amenity.station;

import com.sloway.app.place.entity.amenity.station.StationAmenityEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StationAmenityRepository extends JpaRepository<StationAmenityEntity, Long>, StationAmenityRepositoryCustom {
}
