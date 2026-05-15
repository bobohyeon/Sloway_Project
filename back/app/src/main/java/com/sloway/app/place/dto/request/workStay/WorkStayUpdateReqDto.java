package com.sloway.app.place.dto.request.workStay;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class WorkStayUpdateReqDto {

    private Long workNo;
    private String title;
    private String content;
    private int basePeople;
    private int maxPeople;
    private int rooms;
    private LocalDateTime checkIn;
    private LocalDateTime checkOut;
    private int chargeAdd;
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
