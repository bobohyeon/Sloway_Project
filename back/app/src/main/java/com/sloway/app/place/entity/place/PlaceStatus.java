package com.sloway.app.place.entity.place;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum PlaceStatus {

    I("ING"), S("STOP");

    private final String code;
}
