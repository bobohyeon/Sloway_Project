package com.sloway.app.place.dto.request.workStay.workOffice;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class WorkOfficeUpdateReqDto {

    private Long workNo;
    private int cnt;
    private List<AmenityDto> facilityList;

    @Getter
    @Setter
    public static class AmenityDto {
        private Long amenityNo;
    }
}
