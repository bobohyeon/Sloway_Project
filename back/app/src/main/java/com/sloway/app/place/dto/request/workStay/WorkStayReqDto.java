package com.sloway.app.place.dto.request.workStay;

import com.sloway.app.place.entity.amenity.AmenityEntity;
import com.sloway.app.place.entity.amenity.workStay.WorkAmenityEntity;
import com.sloway.app.place.entity.place.PlaceEntity;
import com.sloway.app.place.entity.workStay.WorkExceptionPeriodEntity;
import com.sloway.app.place.entity.workStay.WorkStayEntity;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class WorkStayReqDto {

    private Long placeNo;
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


    public WorkStayEntity toEntity(PlaceEntity place, List<AmenityEntity> amenities) {
        WorkStayEntity workStay = WorkStayEntity.builder()
                .placeEntity(place)
                .title(title)
                .content(content)
                .cnt(basePeople)
                .maxCnt(maxPeople)
                .rooms(rooms)
                .checkinTime(checkIn)
                .checkoutTime(checkOut)
                .monPrice(monPrice)
                .tuePrice(tuePrice)
                .wedPrice(wedPrice)
                .thuPrice(thuPrice)
                .friPrice(friPrice)
                .satPrice(satPrice)
                .sunPrice(sunPrice)
                .holPrice(holPrice)
                .build();

        // 1. 편의시설 (다대다 또는 중간 엔티티 연결)
        if (facilityList != null && !facilityList.isEmpty() && amenities != null) {
            List<WorkAmenityEntity> amenityEntities = amenities.stream()
                    .map(amenity -> WorkAmenityEntity.builder()
                            .workStayEntity(workStay)
                            .amenityEntity(amenity)
                            .build())
                    .collect(Collectors.toList());

            workStay.setAmenities(amenityEntities);
        }

        // 2. 예외기간 (단순 값 객체 또는 일대다 연결)
        if (exceptionPeriods != null && !exceptionPeriods.isEmpty()) {
            List<WorkExceptionPeriodEntity> periodEntities = exceptionPeriods.stream()
                    .map(epDto -> WorkExceptionPeriodEntity.builder()
                            .startDate(epDto.getStartDate())
                            .endDate(epDto.getEndDate())
                            .monPrice(epDto.getMonPrice())
                            .tuePrice(epDto.getTuePrice())
                            .wedPrice(epDto.getWedPrice())
                            .thuPrice(epDto.getThuPrice())
                            .friPrice(epDto.getFriPrice())
                            .satPrice(epDto.getSatPrice())
                            .sunPrice(epDto.getSunPrice())
                            .holPrice(epDto.getHolPrice())
                            .workStayEntity(workStay)
                            .build())
                    .collect(Collectors.toList());

            workStay.setExceptionPeriods(periodEntities);
        }

        return workStay;
    }

}
