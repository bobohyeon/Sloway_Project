package com.sloway.app.place.dto.response.hostPlace;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class HostPlaceListRespDto {

    //type에 맞는 공간의 no값
    private Long id;

    //HostPlaceEntity.no
    private Long no;

    //PlaceEntity.title
    private String name;

    //HostEntity.name
    private String host;

    //공간유형에따른 type p=place, w=workStay, c=Office, s=station
    private String type;

    //hostPlaceentity.status
    private String status;

    //type에 따른price
    private String price;

    //HostPlaceEntity.createdAt
    private String date;

}
