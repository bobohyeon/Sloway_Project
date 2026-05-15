package com.sloway.app.place.dto.request.office;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class OfficeUpdateReqDto {
    private Long no;
    private Long placeNo;
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

