package com.sloway.app.place.dto.response.station;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StationUpdateDetailRespDto {

    private Long placeNo;
    private String placeTitle;
    private String title;
    private String content;
    private int maxPeople;
    private int basePeople;
    private int rooms;
    private LocalDateTime checkIn;
    private LocalDateTime checkOut;
    private List<AmenityDto> facilityList;
    private int monPrice;
    private int tuePrice;
    private int wedPrice;
    private int thuPrice;
    private int friPrice;
    private int satPrice;
    private int sunPrice;
    private int holPrice;
    private List<ExceptionPeriodDto> exceptionPeriods;

    @Getter
    @Setter
    public static class AmenityDto {
        private Long amenityNo;
    }

    @Getter
    @Setter
    public static class ExceptionPeriodDto {
        private LocalDateTime startDate;
        private LocalDateTime endDate;
        private int monPrice;
        private int tuePrice;
        private int wedPrice;
        private int thuPrice;
        private int friPrice;
        private int satPrice;
        private int sunPrice;
        private int holPrice;
    }

}
