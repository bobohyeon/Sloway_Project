package com.sloway.app.place.repository.workStay;

import com.sloway.app.place.dto.response.place.PlaceImgListRespDto;
import com.sloway.app.place.entity.workStay.ImgWorkStayEntity;

import java.util.List;

public interface ImgWorkStayRepositoryCustom {
    void deleteByWorkStayEntityNoAndNoNotIn(Long no, List<Long> aliveStayImageNos);

    List<ImgWorkStayEntity> findByWorkStayEntityNoAndNoNotIn(Long no, List<Long> aliveStayImageNos);

    List<PlaceImgListRespDto.ImageInfo> getImageList(Long no);
}
