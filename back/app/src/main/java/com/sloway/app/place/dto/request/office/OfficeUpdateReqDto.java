package com.sloway.app.place.dto.request.office;

import com.sloway.app.place.entity.amenity.AmenityEntity;
import com.sloway.app.place.entity.amenity.office.OfficeAmenityEntity;
import com.sloway.app.place.entity.office.OfficeEntity;
import com.sloway.app.place.entity.office.OfficePeriodEntity;
import com.sloway.app.place.entity.place.PlaceEntity;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class OfficeUpdateReqDto {
    private Long no;
    private Long placeNo;
    private String title;
    private String content;
    private int basePeople;
    private List<OfficeReqDto.AmenityDto> facilityList;
    private List<OfficeReqDto.OfficePeriodDto> officePeriods;
    private List<OfficeReqDto.OfficeExceptionPeriodDto> exceptionPeriods;


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

    public OfficeEntity toEntity(PlaceEntity place, List<AmenityEntity> amenityEntities){
        OfficeEntity office = OfficeEntity.builder()
                .placeEntity(place)
                .title(title)
                .content(content)
                .cnt(basePeople)
                .build();
        //편의시시러
        if(facilityList != null && !facilityList.isEmpty() && amenityEntities != null){
            List<OfficeAmenityEntity> amenities = amenityEntities.stream()
                    .map(amenity -> OfficeAmenityEntity.builder()
                            .officeEntity(office)
                            .amenityEntity(amenity)
                            .build())
                    .collect(Collectors.toList());

            office.setAmenities(amenities);
        }

        // 결과적으로 합쳐질 마스터 리스트
        List<OfficePeriodEntity> allPeriods = new ArrayList<>();

        // 기본 요일별 가격 변환 (isException = false)
        if (officePeriods != null && !officePeriods.isEmpty()) {
            allPeriods.addAll(officePeriods.stream()
                    .map(opDto -> OfficePeriodEntity.builder()
                            .officeEntity(office)
                            .price(opDto.getPrice())
                            .dayOfWeek(opDto.getDayOfWeek())
                            .startTime(opDto.getStartTime())
                            .build())
                    .toList());
        }

        // 예외 기간 가격 변환 (isException = true)
        if (exceptionPeriods != null && !exceptionPeriods.isEmpty()) {
            allPeriods.addAll(exceptionPeriods.stream()
                    .map(exDto -> OfficePeriodEntity.builder()
                            .officeEntity(office)
                            .price(exDto.getPrice())
                            .dayOfWeek(exDto.getDayOfWeek())
                            .startTime(exDto.getStartTime())
                            .exceptionStartDate(exDto.getStartDate())
                            .exceptionEndDate(exDto.getEndDate())
                            .build())
                    .toList());
        }

        office.setOfficePeriods(allPeriods);

        return office;
    }
}

