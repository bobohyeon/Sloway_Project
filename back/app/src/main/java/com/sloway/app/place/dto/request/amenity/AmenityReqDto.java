package com.sloway.app.place.dto.request.amenity;

import com.sloway.app.place.entity.amenity.AmenityCategory;
import com.sloway.app.place.entity.amenity.AmenityEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@Builder
public class AmenityReqDto {

    private String name;
    private String category;

    public AmenityEntity toEntity(){
        return AmenityEntity.builder()
                .name(name)
                .category(AmenityCategory.valueOf(category))
                .build();
    }
}
