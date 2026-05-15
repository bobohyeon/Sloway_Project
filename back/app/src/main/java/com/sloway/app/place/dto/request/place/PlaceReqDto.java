package com.sloway.app.place.dto.request.place;

import com.sloway.app.place.entity.place.PlaceEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlaceReqDto {

    private String type;
    private String title;
    private String content;
    private String address;
    private String detailAddress;
    private String latitude;
    private String longitude;

    public PlaceEntity toEntity(){
        PlaceEntity place = PlaceEntity.builder()
                .type(type)
                .title(title)
                .content(content)
                .address(address)
                .detailAdderss(detailAddress)
                .latitude(latitude)
                .longitude(longitude)
                .build();
        return place;
    }
}
