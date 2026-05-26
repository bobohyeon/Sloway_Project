package com.sloway.app.place.repository.workStay;

import com.sloway.app.place.dto.response.station.StationDetailRespDto;
import com.sloway.app.place.dto.response.workStay.WorkStayImageListRespDto;
import com.sloway.app.place.dto.response.workStay.WorkStayUpdateDetailRespDto;

public interface WorkStayRepositoryCustom {
    WorkStayImageListRespDto selectImageList(Long no, Long memberNo);

    StationDetailRespDto selectWorkStayDetailDashBoard(Long no, Long memberNo);

    WorkStayUpdateDetailRespDto selectDetailForUpdate(Long no, Long memberNo);
}
