package com.sloway.app.place.dto.request.amenity;

import com.sloway.app.place.entity.amenity.AmenityCategory;
import com.sloway.app.place.entity.amenity.AmenityEntity;
import lombok.*;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AmenityReqDto {

    private String name;
    private String commonYn;
    private String workStayYn;
    private String officeYn;
    private String stationYn;

    public static AmenityEntity toNoArgsEntity(){
        return AmenityEntity.builder()
                .name(" ")
                .stationYn("N")
                .officeYn("N")
                .workStayYn("N")
                .commonYn("N")
                .build();
    }

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
