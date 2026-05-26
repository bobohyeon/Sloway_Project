package com.sloway.app.place.repository.office;

import com.sloway.app.place.dto.response.office.OfficeUpdateDetailReqDto;
import com.sloway.app.place.dto.response.place.PlaceImgListRespDto;
import com.sloway.app.place.dto.response.station.StationDetailRespDto;

public interface OfficeRepositoryCustom {
    PlaceImgListRespDto selectImageList(Long no, Long memberNo);

    StationDetailRespDto selectOfficeDetailDashBoard(Long no, Long memberNo);

    OfficeUpdateDetailReqDto selectOfficeForUpdate(Long no, Long memberNo);
}
