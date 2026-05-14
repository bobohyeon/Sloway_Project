package com.sloway.app.place.dto.request.station;

import com.sloway.app.place.entity.amenity.AmenityEntity;
import com.sloway.app.place.entity.amenity.station.StationAmenityEntity;
import com.sloway.app.place.entity.place.PlaceEntity;
import com.sloway.app.place.entity.station.ImgStationEntity;
import com.sloway.app.place.entity.station.StationEntity;
import com.sloway.app.place.entity.station.StationExceptionPeriodEntity;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Getter
@Setter
public class StationReqDto {

    private Long placeNo;
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
        private int amenityNo;
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

    public StationEntity toEntity(PlaceEntity place, List<AmenityEntity> amenities) {
        StationEntity station = StationEntity.builder()
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
            List<StationAmenityEntity> amenityEntities = amenities.stream()
                    .map(amenity -> StationAmenityEntity.builder()
                            .stationEntity(station)
                            .amenityEntity(amenity)
                            .build())
                    .collect(Collectors.toList());

            station.setAmenities(amenityEntities);
        }

        // 2. 예외기간 (단순 값 객체 또는 일대다 연결)
        if (exceptionPeriods != null && !exceptionPeriods.isEmpty()) {
            List<StationExceptionPeriodEntity> periodEntities = exceptionPeriods.stream()
                    .map(epDto -> StationExceptionPeriodEntity.builder()
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
                            .stationEntity(station)
                            .build())
                    .collect(Collectors.toList());

            station.setExceptionPeriods(periodEntities);
        }

        return station;
    }
}
