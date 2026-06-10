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

import java.util.Comparator;
import java.util.List;

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
    private Integer maxCnt;
    private Integer basePrice;
    private List<String> amenities;
    private List<String> images;

    private String checkinTime;
    private String checkoutTime;

    private String latitude;
    private String longitude;

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
                .maxCnt(office.getCnt())
                .basePrice(office.getOfficePeriodEntities().stream()
                        .mapToInt(OfficePeriodEntity::getPrice)
                        .min()
                        .orElse(0))
                .images(office.getImages().stream()
                        .sorted(Comparator.comparingInt(ImgOfficeEntity::getSort))
                        .map(ImgOfficeEntity::getCurrentUrl)
                        .toList())
                .checkinTime(null)
                .checkoutTime(null)
                .latitude(office.getPlaceEntity().getLatitude())
                .longitude(office.getPlaceEntity().getLongitude())
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
                .maxCnt(station.getMaxCnt())
                .basePrice(station.getMonPrice())
                .images(station.getImages().stream()
                        .sorted(Comparator.comparingInt(ImgStationEntity::getSort))
                        .map(ImgStationEntity::getCurrentUrl)
                        .toList())
                .checkinTime(station.getCheckinTime().toLocalTime().toString())
                .checkoutTime(station.getCheckoutTime().toLocalTime().toString())
                .latitude(station.getPlaceEntity().getLatitude())
                .longitude(station.getPlaceEntity().getLongitude())
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
                .maxCnt(workStay.getMaxCnt())
                .basePrice(workStay.getMonPrice())
                .images(workStay.getImages().stream()
                        .sorted(Comparator.comparingInt(ImgWorkStayEntity::getSort))
                        .map(ImgWorkStayEntity::getCurrentUrl)
                        .toList())
                .checkinTime(workStay.getCheckinTime().toLocalTime().toString())
                .checkoutTime(workStay.getCheckoutTime().toLocalTime().toString())
                .latitude(workStay.getPlaceEntity().getLatitude())
                .longitude(workStay.getPlaceEntity().getLongitude())
                .build();
    }
}
