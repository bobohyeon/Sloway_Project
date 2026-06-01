package com.sloway.app.place.repository.station;

import com.sloway.app.place.entity.station.ImgStationEntity;

import java.util.List;

public interface ImgStationRepositoryCustom {
    void deleteByStationEntityNoAndNoNotIn(Long no, List<Long> aliveImageNos);

    List<ImgStationEntity> findByStationEntityNoAndNoNotIn(Long no, List<Long> aliveImageNos);
}
