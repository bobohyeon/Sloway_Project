package com.sloway.app.place.repository.place;

import com.sloway.app.place.dto.response.place.PlaceDetailListRespDto;
import com.sloway.app.place.dto.response.place.PlaceListRespDto;

import java.util.List;

public interface PlaceRepositoryCustom {
    List<PlaceDetailListRespDto> findPlaceDetailListByHostNo(Long placeNo, Long hostNo);

    List<PlaceListRespDto> findPlaceListByHostNo(Long hostNo);
}
