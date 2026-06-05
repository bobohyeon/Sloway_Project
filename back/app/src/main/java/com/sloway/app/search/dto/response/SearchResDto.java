package com.sloway.app.search.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder
public class SearchResDto {

    private Long entityNo;
    private String title;
    private String type;
    private String address;

    // 썸네일 이미지 URL - ImgPlaceEntity에 SORT가 있어서, SORT = 0 인걸로 꺼내와야 할듯?
    private String thumbnailUrl;

    // 평점은 화면에서 별(5개)로 표시, 1~5점 까지 선택가능.
    private Double avgScore;

    // 대표 가격 = 최소 가격
    private Integer basePrice;

    // 기능명세서: "날짜 미선택 시 잔여 객실 수 미표시" → null 허용
    // 숙소/워크앤스테이: 잔여 객실 수
    // 코워킹오피스: 잔여 좌석 수
    private Integer remainCount;

    // remainCount가 0이면 false
    // 날짜 미선택이면 null (표시 안 함)
    private Boolean available;

}
