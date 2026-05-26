package com.sloway.app.place.dto.response.office;

import com.sloway.app.place.dto.request.office.OfficeReqDto;
import com.sloway.app.place.dto.response.station.StationUpdateDetailRespDto;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class OfficeUpdateDetailReqDto {

    private Long placeNo;
    private String placeTitle;
    private String title;
    private String content;
    private int basePeople;
    private List<AmenityDto> facilityList;
    private List<OfficePeriodDto> officePeriods;
    private List<OfficeExceptionPeriodDto> exceptionPeriods;


    @Getter
    @Setter
    public static class AmenityDto {
        private Long amenityNo;
    }

    @Getter
    @Setter
    public static class OfficePeriodDto {
        private LocalDateTime startTime;
        private int price;
        private String dayOfWeek;
    }

    @Getter
    @Setter
    public static class OfficeExceptionPeriodDto {
        private LocalDateTime startTime;
        private int price;
        private String dayOfWeek;
        private LocalDateTime startDate;
        private LocalDateTime endDate;
    }

}
