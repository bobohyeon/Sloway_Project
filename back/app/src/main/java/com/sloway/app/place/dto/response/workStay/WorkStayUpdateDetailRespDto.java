package com.sloway.app.place.dto.response.workStay;

import com.sloway.app.place.dto.request.workStay.WorkStayUpdateReqDto;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WorkStayUpdateDetailRespDto {

    private Long placeNo;
    private String placeTitle;
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
    private OfficeDto office;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OfficeDto {
        private Long officeNo;
        private Integer cnt;
        private List<Long> amenityNoList;
    }

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
