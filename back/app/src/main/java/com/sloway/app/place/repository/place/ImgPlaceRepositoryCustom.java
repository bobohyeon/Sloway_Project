package com.sloway.app.place.repository.place;

import com.sloway.app.place.dto.response.place.PlaceImgListRespDto;
import com.sloway.app.place.entity.place.ImgPlaceEntity;

import java.util.List;

public interface ImgPlaceRepositoryCustom {
    void deleteByPlaceEntityNoAndNoNotIn(Long no, List<Long> aliveImageNos);

    List<ImgPlaceEntity> findByPlaceEntityNoAndNoNotIn(Long no, List<Long> aliveImageNos);

    List<PlaceImgListRespDto.ImageInfo> getImageList(Long no);
}
