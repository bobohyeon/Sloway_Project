package com.sloway.app.reservation.rsvn.dto.response;

import com.sloway.app.place.entity.hostPlace.HostPlaceEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class HostSpaceResDto {

    private Long placeNo;
    private String spaceName;
    private String spaceType;
    private long reservationCount; // 해당 공간의 예약 건수 (어드민 호스트 상세용)

    // 기존 호출 호환 — 예약수 미사용(호스트 본인 공간 선택 등)
    public static HostSpaceResDto from(HostPlaceEntity hp) {
        return from(hp, 0L);
    }

    public static HostSpaceResDto from(HostPlaceEntity hp, long reservationCount) {
        Long placeNo = null;
        String spaceName = null;
        String spaceType = null;

        if (hp.getWorkStayEntity() != null) {
            placeNo = hp.getWorkStayEntity().getPlaceEntity().getNo();
            spaceName = hp.getWorkStayEntity().getTitle();
            spaceType = hp.getWorkStayEntity().getPlaceEntity().getType();
        } else if (hp.getOfficeEntity() != null) {
            placeNo = hp.getOfficeEntity().getPlaceEntity().getNo();
            spaceName = hp.getOfficeEntity().getTitle();
            spaceType = hp.getOfficeEntity().getPlaceEntity().getType();
        } else if (hp.getStationEntity() != null) {
            placeNo = hp.getStationEntity().getPlaceEntity().getNo();
            spaceName = hp.getStationEntity().getTitle();
            spaceType = hp.getStationEntity().getPlaceEntity().getType();
        } else if (hp.getPlaceEntity() != null) {
            placeNo = hp.getPlaceEntity().getNo();
            spaceName = hp.getPlaceEntity().getTitle();
            spaceType = hp.getPlaceEntity().getType();
        }

        return HostSpaceResDto.builder()
                .placeNo(placeNo)
                .spaceName(spaceName)
                .spaceType(spaceType)
                .reservationCount(reservationCount)
                .build();
    }
}
