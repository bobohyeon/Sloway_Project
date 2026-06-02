package com.sloway.app.place.repository.office;

import com.sloway.app.place.dto.response.place.PlaceImgListRespDto;
import com.sloway.app.place.entity.office.ImgOfficeEntity;

import java.util.List;

public interface ImgOfficeRepositoryCustom {
    void deleteByOfficeEntityNoAndNoNotIn(Long no, List<Long> aliveImageNos);

    List<ImgOfficeEntity> findByOfficeEntityNoAndNoNotIn(Long no, List<Long> aliveImageNos);

    List<PlaceImgListRespDto.ImageInfo> getImageList(Long no);
}
