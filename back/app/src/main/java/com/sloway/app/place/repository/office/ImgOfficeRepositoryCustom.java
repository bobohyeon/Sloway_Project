package com.sloway.app.place.repository.office;

import java.util.List;

public interface ImgOfficeRepositoryCustom {
    void deleteByOfficeEntityNoAndNoNotIn(Long no, List<Long> aliveImageNos);
}
