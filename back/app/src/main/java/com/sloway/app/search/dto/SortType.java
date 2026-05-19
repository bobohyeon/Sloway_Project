package com.sloway.app.search.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum SortType {

    POPULAR("인기순"), PRICE_DESC("가격높은순"), PRICE_ASC("가격낮은순"), SCORE("평점순");

    private final String code;
}
