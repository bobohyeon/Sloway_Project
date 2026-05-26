package com.sloway.app.place.repository.station;

import java.util.List;

public interface ImgStationRepositoryCustom {
    void deleteByStationEntityNoAndNoNotIn(Long no, List<Long> aliveImageNos);
}
