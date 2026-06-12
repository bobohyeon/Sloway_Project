package com.sloway.app.search.placeDetail.dto;

import com.sloway.app.place.entity.office.ImgOfficeEntity;
import com.sloway.app.place.entity.office.OfficeEntity;
import com.sloway.app.place.entity.office.OfficePeriodEntity;
import com.sloway.app.place.entity.station.ImgStationEntity;
import com.sloway.app.place.entity.station.StationEntity;
import com.sloway.app.place.entity.workStay.ImgWorkStayEntity;
import com.sloway.app.place.entity.workStay.WorkStayEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
public class PlaceDetailResDto {

    private Long entityNo;
    private Long placeNo;
    private String type;
    private String title;
    private String content;
    private String address;
    private Integer baseCnt;
    private Integer maxCnt;
    private Integer basePrice;
    private List<String> amenities;
    private List<String> images;

    private String checkinTime;
    private String checkoutTime;

    private String latitude;
    private String longitude;

    private List<ExceptionPeriodDto> exceptionPeriods;
    //       예외기간 가격 리스트. 날짜 선택 시 프론트에서 재계산에 사용.

    private Integer chargeAdd;

    public static PlaceDetailResDto from(OfficeEntity office) {
        return PlaceDetailResDto.builder()
                .entityNo(office.getNo())
                .placeNo(office.getPlaceEntity().getNo())
                .type(office.getPlaceEntity().getType())
                .title(office.getTitle())
                .content(office.getContent())
                .address(office.getPlaceEntity().getAddress())
                .amenities(office.getOfficeAmenityEntities().stream()
                        .map(a -> a.getAmenityEntity().getName())
                        .toList())
                .baseCnt(null)
                .maxCnt(office.getCnt())
                .basePrice(office.getOfficePeriodEntities().stream()
                        .filter(op -> op.getExceptionStartDate() == null)
                        .mapToInt(OfficePeriodEntity::getPrice)
                        .min()
                        .orElse(0))
                .images(office.getImages().stream()
                        .sorted(Comparator.comparing(ImgOfficeEntity::getSort, Comparator.nullsLast(Integer::compareTo)))
                        .map(ImgOfficeEntity::getCurrentUrl)
                        .toList())
                .checkinTime(null)
                .checkoutTime(null)
                .latitude(office.getPlaceEntity().getLatitude())
                .longitude(office.getPlaceEntity().getLongitude())
                .exceptionPeriods(
                        office.getOfficePeriodEntities().stream().filter(
                                officePeriod -> officePeriod.getExceptionStartDate() != null)
                                .collect(Collectors.groupingBy(op -> List.of(op.getExceptionStartDate(), op.getExceptionEndDate())))
                                        .entrySet().stream()
                                .map(entry -> {
                                    List<OfficePeriodEntity> rows = entry.getValue();
                                    LocalDate startDate = entry.getKey().get(0).toLocalDate();
                                    LocalDate endDate = entry.getKey().get(1).toLocalDate();

                                    int monPrice = rows.stream()
                                            .filter(r -> "MON".equals(r.getDayOfWeek()))
                                            .mapToInt(OfficePeriodEntity::getPrice)
                                            .findFirst().orElse(0);
                                    int tuePrice = rows.stream()
                                            .filter(r -> "TUE".equals(r.getDayOfWeek()))
                                            .mapToInt(OfficePeriodEntity::getPrice)
                                            .findFirst().orElse(0);
                                    int wedPrice = rows.stream()
                                            .filter(r -> "WED".equals(r.getDayOfWeek()))
                                            .mapToInt(OfficePeriodEntity::getPrice)
                                            .findFirst().orElse(0);
                                    int thuPrice = rows.stream()
                                            .filter(r -> "THU".equals(r.getDayOfWeek()))
                                            .mapToInt(OfficePeriodEntity::getPrice)
                                            .findFirst().orElse(0);
                                    int friPrice = rows.stream()
                                            .filter(r -> "FRI".equals(r.getDayOfWeek()))
                                            .mapToInt(OfficePeriodEntity::getPrice)
                                            .findFirst().orElse(0);
                                    int satPrice = rows.stream()
                                            .filter(r -> "SAT".equals(r.getDayOfWeek()))
                                            .mapToInt(OfficePeriodEntity::getPrice)
                                            .findFirst().orElse(0);
                                    int sunPrice = rows.stream()
                                            .filter(r -> "SUN".equals(r.getDayOfWeek()))
                                            .mapToInt(OfficePeriodEntity::getPrice)
                                            .findFirst().orElse(0);
                                    int holPrice = rows.stream()
                                            .filter(r -> "HOL".equals(r.getDayOfWeek()))
                                            .mapToInt(OfficePeriodEntity::getPrice)
                                            .findFirst().orElse(0);

                                    return new ExceptionPeriodDto(startDate, endDate, monPrice, tuePrice, wedPrice,
                                            thuPrice, friPrice, satPrice, sunPrice, holPrice);
                                })
                                .toList()
                )
                .chargeAdd(null)
                .build();
    }

    public static PlaceDetailResDto from(StationEntity station) {
        return PlaceDetailResDto.builder()
                .entityNo(station.getNo())
                .placeNo(station.getPlaceEntity().getNo())
                .type(station.getPlaceEntity().getType())
                .title(station.getTitle())
                .content(station.getContent())
                .address(station.getPlaceEntity().getAddress())
                .amenities(station.getStationAmenityEntities().stream()
                        .map(a -> a.getAmenityEntity().getName())
                        .toList())
                .baseCnt(station.getCnt())
                .maxCnt(station.getMaxCnt())
                .basePrice(station.getMonPrice())
                .images(station.getImages().stream()
                        .sorted(Comparator.comparing(ImgStationEntity::getSort, Comparator.nullsLast(Integer::compareTo)))
                        .map(ImgStationEntity::getCurrentUrl)
                        .toList())
                .checkinTime(station.getCheckinTime().toLocalTime().toString())
                .checkoutTime(station.getCheckoutTime().toLocalTime().toString())
                .latitude(station.getPlaceEntity().getLatitude())
                .longitude(station.getPlaceEntity().getLongitude())
                .exceptionPeriods(station.getStationExceptionPeriodEntities().stream()
                        .map(s -> new ExceptionPeriodDto(
                                s.getStartDate().toLocalDate(),
                                s.getEndDate().toLocalDate(),
                                s.getMonPrice(),
                                s.getTuePrice(),
                                s.getWedPrice(),
                                s.getThuPrice(),
                                s.getFriPrice(),
                                s.getSatPrice(),
                                s.getSunPrice(),
                                s.getHolPrice()
                        ))
                        .toList()
                )
                .chargeAdd(station.getChargeAdd())
                .build();
    }

    public static PlaceDetailResDto from(WorkStayEntity workStay) {
        return PlaceDetailResDto.builder()
                .entityNo(workStay.getNo())
                .placeNo(workStay.getPlaceEntity().getNo())
                .type(workStay.getPlaceEntity().getType())
                .title(workStay.getTitle())
                .content(workStay.getContent())
                .address(workStay.getPlaceEntity().getAddress())
                .amenities(workStay.getWorkAmenityEntities().stream()
                        .map(a -> a.getAmenityEntity().getName())
                        .toList())
                .baseCnt(workStay.getCnt())
                .maxCnt(workStay.getMaxCnt())
                .basePrice(workStay.getMonPrice())
                .images(workStay.getImages().stream()
                        .sorted(Comparator.comparing(ImgWorkStayEntity::getSort, Comparator.nullsLast(Integer::compareTo)))
                        .map(ImgWorkStayEntity::getCurrentUrl)
                        .toList())
                .checkinTime(workStay.getCheckinTime().toLocalTime().toString())
                .checkoutTime(workStay.getCheckoutTime().toLocalTime().toString())
                .latitude(workStay.getPlaceEntity().getLatitude())
                .longitude(workStay.getPlaceEntity().getLongitude())
                .exceptionPeriods(workStay.getWorkExceptionPeriodEntities().stream()
                        .map(s -> new ExceptionPeriodDto(
                                s.getStartDate().toLocalDate(),
                                s.getEndDate().toLocalDate(),
                                s.getMonPrice(),
                                s.getTuePrice(),
                                s.getWedPrice(),
                                s.getThuPrice(),
                                s.getFriPrice(),
                                s.getSatPrice(),
                                s.getSunPrice(),
                                s.getHolPrice()
                        ))
                        .toList()
                )
                .chargeAdd(workStay.getChargeAdd())
                .build();
    }
}
