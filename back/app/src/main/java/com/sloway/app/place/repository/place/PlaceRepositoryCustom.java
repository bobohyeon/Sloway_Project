package com.sloway.app.place.repository.place;

import com.sloway.app.place.dto.request.place.PlaceUpdateReqDto;
import com.sloway.app.place.dto.response.place.MasterPlaceRespDto;
import com.sloway.app.place.dto.response.place.PlaceDetailListRespDto;
import com.sloway.app.place.dto.response.place.PlaceImgListRespDto;
import com.sloway.app.place.dto.response.place.PlaceListRespDto;

import java.util.List;

public interface PlaceRepositoryCustom {
    List<PlaceDetailListRespDto> findPlaceDetailListByHostNo(Long placeNo, Long hostNo);

    List<PlaceListRespDto> findPlaceListByHostNo(Long hostNo);

    List<MasterPlaceRespDto> findMasterPlaceListByTypeAndMemberNo(String type, Long memberNo);

    PlaceUpdateReqDto selectPlaceForUpdate(Long memberNo, Long no);

    PlaceImgListRespDto selectImageList(Long no, Long memberNo);
}
