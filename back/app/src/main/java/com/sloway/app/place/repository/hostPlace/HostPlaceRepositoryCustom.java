package com.sloway.app.place.repository.hostPlace;

import com.sloway.app.place.dto.response.hostPlace.HostPlaceListRespDto;

import java.util.List;

public interface HostPlaceRepositoryCustom {
    List<HostPlaceListRespDto> findHostPlaceList();
}
