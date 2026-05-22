package com.sloway.app.place.repository.workStay.workOffice;

import java.util.List;

public interface ImgWorkOfficeRepositoryCustom {
    void deleteByWorkOfficeEntityNoAndNoNotIn(Long no, List<Long> aliveOfficeImageNos);
}
