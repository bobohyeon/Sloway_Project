package com.sloway.app.place.dto.response.amenity;

import com.sloway.app.place.entity.amenity.AmenityEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AmenityInsertRespDto {

    private Long no;
    private String name;
    private String commonYn;
    private String workStayYn;
    private String officeYn;
    private String stationYn;

    public static AmenityInsertRespDto from(AmenityEntity entity){
        return AmenityInsertRespDto.builder()
                .no(entity.getNo())
                .name(entity.getName())
                .commonYn(entity.getCommonYn())
                .officeYn(entity.getOfficeYn())
                .stationYn(entity.getStationYn())
                .workStayYn(entity.getWorkStayYn())
                .build();
    }

}
