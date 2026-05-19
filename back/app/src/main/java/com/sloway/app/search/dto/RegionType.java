package com.sloway.app.search.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum RegionType {

    SEOUL("서울"), GYEONGGI("경기"), JEONRA("전라"),
    GYEONGSANG("경상"), CHUNGCHEONG("충청"), JEJU("제주"),
    GANGWON("강원"), INCHEON("인천");

    private final String code;
}
