package com.sloway.app.place.dto.response.place;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PlaceListRespDto {
    private Long id;
    private String type;
    private String status;
    private String title;
    private String location;
    private double rating;
    private int reviews;
    private int monthlyBookings;
    private int price;
    private String thumbnail;

}
