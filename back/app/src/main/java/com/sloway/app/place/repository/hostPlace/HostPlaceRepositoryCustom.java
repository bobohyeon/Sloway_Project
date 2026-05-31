package com.sloway.app.place.repository.hostPlace;

import com.sloway.app.place.dto.response.hostPlace.ApprovalCheckRespDto;
import com.sloway.app.place.dto.response.hostPlace.ApprovalDetailRespDto;
import com.sloway.app.place.dto.response.hostPlace.HostPlaceListRespDto;
import com.sloway.app.place.entity.hostPlace.HostPlaceEntity;

import java.util.List;

public interface HostPlaceRepositoryCustom {
    List<HostPlaceListRespDto> findHostPlaceList();

    ApprovalCheckRespDto checkRejectReason(String type, Long no, Long memberNo);

    ApprovalDetailRespDto findCommonData(Long no);

    ApprovalDetailRespDto findStationDetail(Long no);

    ApprovalDetailRespDto findOfficeDetail(Long no);

    ApprovalDetailRespDto findWorkStayDetail(Long no);

    HostPlaceEntity findHostPlaceLatest(Long no, Long hostNo);

    HostPlaceEntity findHostWorkLatest(Long no, Long hostNo);

    HostPlaceEntity findHostStationLatest(Long no, Long hostNo);

    HostPlaceEntity findHostOfficeLatest(Long no, Long hostNo);
}
