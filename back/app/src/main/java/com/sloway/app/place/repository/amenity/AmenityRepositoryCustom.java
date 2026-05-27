package com.sloway.app.place.repository.amenity;

import com.sloway.app.place.dto.response.amenity.AmenityListRespDto;

public interface AmenityRepositoryCustom {
    AmenityListRespDto findAllByDelYn(String n);

    AmenityListRespDto findAllByDelYnAndType(String type);
}
