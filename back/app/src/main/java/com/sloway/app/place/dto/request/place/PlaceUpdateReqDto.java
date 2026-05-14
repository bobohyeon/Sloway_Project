package com.sloway.app.place.dto.request.place;

import com.sloway.app.place.entity.place.PlaceEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlaceUpdateReqDto {

    private String title;
    private String content;

    public PlaceEntity toEntity(){
        return PlaceEntity.builder()
                .title(title)
                .content(content)
                .build();
    }

}
