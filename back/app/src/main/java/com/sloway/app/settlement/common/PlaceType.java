package com.sloway.app.settlement.common;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum PlaceType {

    station("숙소", 10),
    workStay("워크앤스테이", 12),
    office("오피스", 10);

    private final String name;
    private final Integer rate;
}
