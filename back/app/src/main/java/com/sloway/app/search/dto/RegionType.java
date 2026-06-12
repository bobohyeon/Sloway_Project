package com.sloway.app.search.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Getter
@RequiredArgsConstructor
public enum RegionType {

    SEOUL("서울",         List.of("서울")),
    GYEONGGI("경기",     List.of("경기")),
    INCHEON("인천",      List.of("인천")),
    GANGWON("강원",      List.of("강원")),
    CHUNGCHEONG("충청",  List.of("충청북도", "충청남도", "대전", "세종")),
    JEONRA("전라",       List.of("전라북도", "전라남도", "광주")),
    GYEONGSANG("경상",   List.of("경상북도", "경상남도", "부산", "대구", "울산")),
    JEJU("제주",         List.of("제주"));

    private final String code;
    private final List<String> keywords;
}
