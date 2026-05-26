package com.sloway.app.place.repository.station;

import com.sloway.app.place.entity.station.ImgStationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImgStationRepository extends JpaRepository<ImgStationEntity, Long>, ImgStationRepositoryCustom {
    void deleteAllByStationEntityNo(Long no);
}
