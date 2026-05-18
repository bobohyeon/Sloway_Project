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
    private String commonYn;
    private String workStayYn;
    private String officeYn;
    private String stationYn;

    public AmenityEntity toEntity(){
        return AmenityEntity.builder()
                .name(name)
                .commonYn(commonYn)
                .workStayYn(workStayYn)
                .officeYn(officeYn)
                .stationYn(stationYn)
                .build();
    }
}
