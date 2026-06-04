package com.sloway.app.search.placeDetail.dto;

import com.sloway.app.place.entity.office.OfficeEntity;
import com.sloway.app.place.entity.station.StationEntity;
import com.sloway.app.place.entity.workStay.WorkStayEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
public class PlaceDetailResDto {

    private String type;
    private String title;
    private String content;
    private String address;
    private Integer maxCnt;
    private Integer basePrice;
    private List<String> amenities;

    private String checkinTime;
    private String checkoutTime;

    public static PlaceDetailResDto from(OfficeEntity office){
        return PlaceDetailResDto.builder()
                .type(office.getPlaceEntity().getType())
                .title(office.getTitle())
                .content(office.getContent())
                .address(office.getPlaceEntity().getAddress())
                .amenities(
                        office
                                .getOfficeAmenityEntities()
                                .stream()
                                .map(a -> a.getAmenityEntity().getName())
                                .toList())
                .maxCnt(office.getCnt())
                .basePrice(null)
                .checkinTime(null)
                .checkoutTime(null)
                .build();
    }

    public static PlaceDetailResDto from(StationEntity station){
        return PlaceDetailResDto.builder()
                .type(station.getPlaceEntity().getType())
                .title(station.getTitle())
                .content(station.getContent())
                .address(station.getPlaceEntity().getAddress())
                .amenities(
                        station
                                .getStationAmenityEntities()
                                .stream()
                                .map(a -> a.getAmenityEntity().getName())
                                .toList())
                .maxCnt(station.getMaxCnt())
                .basePrice(station.getMonPrice())
                .checkinTime(station.getCheckinTime().toLocalTime().toString())
                .checkoutTime(station.getCheckoutTime().toLocalTime().toString())
                .build();
    }

    public static PlaceDetailResDto from(WorkStayEntity workStay){
        return PlaceDetailResDto.builder()
                .type(workStay.getPlaceEntity().getType())
                .title(workStay.getTitle())
                .content(workStay.getContent())
                .address(workStay.getPlaceEntity().getAddress())
                .amenities(
                        workStay
                                .getWorkAmenityEntities()
                                .stream()
                                .map(a -> a.getAmenityEntity().getName())
                                .toList())
                .maxCnt(workStay.getMaxCnt())
                .basePrice(workStay.getMonPrice())
                .checkinTime(workStay.getCheckinTime().toLocalTime().toString())
                .checkoutTime(workStay.getCheckoutTime().toLocalTime().toString())
                .build();
    }
}
