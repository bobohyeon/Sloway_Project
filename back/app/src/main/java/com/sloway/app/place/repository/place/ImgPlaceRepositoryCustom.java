package com.sloway.app.place.repository.place;

import java.util.List;

public interface ImgPlaceRepositoryCustom {
    void deleteByPlaceEntityNoAndNoNotIn(Long no, List<Long> aliveImageNos);
}
