package com.sloway.app.place.dto.response.amenity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AmenityListRespDto {
    List<AmenityDetailDto> amenityList;

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class AmenityDetailDto{

        private Long no;
        private String name;
        private String commonYn;
        private String workStayYn;
        private String officeYn;
        private String stationYn;
    }
}
