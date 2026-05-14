package com.sloway.app.place.repository.station;

import com.sloway.app.place.entity.station.StationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StationRepository extends JpaRepository<StationEntity, Long>, StationRepositoryCustom {

}
