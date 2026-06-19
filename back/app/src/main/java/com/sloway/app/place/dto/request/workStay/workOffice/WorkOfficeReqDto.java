package com.sloway.app.place.dto.request.workStay.workOffice;

import com.sloway.app.place.entity.amenity.AmenityEntity;
import com.sloway.app.place.entity.amenity.workStay.workOffice.WorkOfficeAmenityEntity;
import com.sloway.app.place.entity.workStay.WorkStayEntity;
import com.sloway.app.place.entity.workStay.workOffice.WorkOfficeEntity;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class WorkOfficeReqDto {

    private Long workNo;
    private int cnt;
    private List<AmenityDto> facilityList;

    @Getter
    @Setter
    public static class AmenityDto {
        private Long amenityNo;
    }

    public WorkOfficeEntity toEntity(WorkStayEntity workStay, int cnt, List<AmenityEntity> amenities) {
        WorkOfficeEntity workOffice = WorkOfficeEntity.builder()
                .workStayEntity(workStay)
                .cnt(cnt)
                .build();

        // 1. 편의시설 (다대다 또는 중간 엔티티 연결)
        if (facilityList != null && !facilityList.isEmpty() && amenities != null) {
            List<WorkOfficeAmenityEntity> amenityEntities = amenities.stream()
                    .map(amenity -> WorkOfficeAmenityEntity.builder()
                            .workOfficeEntity(workOffice)
                            .amenityEntity(amenity)
                            .build())
                    .collect(Collectors.toList());

            workOffice.setAmenities(amenityEntities);
        }

        return workOffice;
    }
}
