package com.sloway.app.place.repository.hostPlace;

import com.sloway.app.place.dto.response.hostPlace.ApprovalCheckRespDto;
import com.sloway.app.place.dto.response.hostPlace.ApprovalDetailRespDto;
import com.sloway.app.place.dto.response.hostPlace.HostPlaceListRespDto;

import java.util.List;

public interface HostPlaceRepositoryCustom {
    List<HostPlaceListRespDto> findHostPlaceList();

    ApprovalCheckRespDto checkRejectReason(String type, Long no, Long memberNo);

    ApprovalDetailRespDto findCommonData(Long no);

    ApprovalDetailRespDto findStationDetail(Long no);

    ApprovalDetailRespDto findOfficeDetail(Long no);

    ApprovalDetailRespDto findWorkStayDetail(Long no);
}
