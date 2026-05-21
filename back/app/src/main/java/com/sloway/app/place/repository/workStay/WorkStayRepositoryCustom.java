package com.sloway.app.place.repository.workStay;

import com.sloway.app.place.dto.response.workStay.WorkStayImageListRespDto;

public interface WorkStayRepositoryCustom {
    WorkStayImageListRespDto selectImageList(Long no, Long memberNo);
}
