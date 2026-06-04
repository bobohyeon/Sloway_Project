package com.sloway.app.place.repository.workStay.workOffice;

import com.sloway.app.place.dto.response.place.PlaceImgListRespDto;
import com.sloway.app.place.entity.workStay.workOffice.ImgWorkStayOfficeEntity;

import java.util.List;

public interface ImgWorkOfficeRepositoryCustom {
    void deleteByWorkOfficeEntityNoAndNoNotIn(Long no, List<Long> aliveOfficeImageNos);

    List<ImgWorkStayOfficeEntity> findByWorkOfficeEntityNoAndNoNotIn(Long no, List<Long> aliveOfficeImageNos);

    List<PlaceImgListRespDto.ImageInfo> getImageList(Long no);
}
