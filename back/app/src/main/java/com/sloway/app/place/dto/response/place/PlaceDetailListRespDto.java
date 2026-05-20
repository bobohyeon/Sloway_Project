package com.sloway.app.place.dto.response.place;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@AllArgsConstructor
public class PlaceDetailListRespDto {

    private Long id;

    private String type;

    private String thumbnail;

    private String title;

    private String createdAt;

    private double rating;
}
