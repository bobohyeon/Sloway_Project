package com.sloway.app.place.dto.request.place;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@AllArgsConstructor
public class PlaceUpdateReqDto {

    private Long no;
    private String title;
    private String content;

}
