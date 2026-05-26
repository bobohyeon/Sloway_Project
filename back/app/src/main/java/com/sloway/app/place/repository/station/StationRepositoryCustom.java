package com.sloway.app.place.repository.station;

import com.sloway.app.place.dto.response.place.PlaceImgListRespDto;
import com.sloway.app.place.dto.response.station.StationDetailRespDto;
import com.sloway.app.place.dto.response.station.StationUpdateDetailRespDto;

public interface StationRepositoryCustom {
    PlaceImgListRespDto selectImageList(Long no, Long memberNo);

    StationDetailRespDto selectStationDetailDashBoard(Long no, Long memberNo);

    StationUpdateDetailRespDto selectDetailForUpdate(Long no, Long memberNo);
}
