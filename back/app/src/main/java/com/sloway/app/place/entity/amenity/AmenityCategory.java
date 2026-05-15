package com.sloway.app.place.entity.amenity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum AmenityCategory {

    O("OFFICE"), W("WORK_STAY"), S("STATION"), C("COMMON");

    private final String code;
}
