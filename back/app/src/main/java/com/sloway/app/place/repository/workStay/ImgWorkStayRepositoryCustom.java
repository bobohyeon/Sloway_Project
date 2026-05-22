package com.sloway.app.place.repository.workStay;

import java.util.List;

public interface ImgWorkStayRepositoryCustom {
    void deleteByWorkStayEntityNoAndNoNotIn(Long no, List<Long> aliveStayImageNos);
}
