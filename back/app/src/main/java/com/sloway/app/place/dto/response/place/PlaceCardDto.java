package com.sloway.app.place.dto.response.place;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlaceCardDto {

    private Long masterNo;
    private Long placeNo;
    private String title;
    private String type;
    private String mainImageUrl;
    private String address;
    private Integer price;

    private Integer finalScore;
    private Integer totalReservations;
    private Double avgReviewScore;

    // 상태 값
    private boolean isNew;
    private String status;
}