package com.sloway.app.place.repository.office;

import com.sloway.app.place.dto.response.place.PlaceImgListRespDto;

public interface OfficeRepositoryCustom {
    PlaceImgListRespDto selectImageList(Long no, Long memberNo);
}
