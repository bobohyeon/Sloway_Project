package com.sloway.app.reservation.rsvn.dto.response;

import com.sloway.app.place.entity.hostPlace.HostPlaceEntity;
import com.sloway.app.place.entity.place.ImgPlaceEntity;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@EqualsAndHashCode
public class HostSpaceResDto {

    private Long placeNo;
    private Long entityNo;
    private String placeImg;
    private String placeTitle; // 상위 공간명 (place.title)
    private String spaceName;  // 하위 공간명 (office/station/workStay.title)
    private String spaceType;
    private long reservationCount; // 해당 공간의 예약 건수 (어드민 호스트 상세용)

    // 기존 호출 호환 — 예약수 미사용(호스트 본인 공간 선택 등)
    public static HostSpaceResDto from(HostPlaceEntity hp, String placeImg) {
        return from(hp, 0L, placeImg);
    }

    public static HostSpaceResDto from(HostPlaceEntity hp, long reservationCount, String placeImg) {
        Long placeNo = null;
        Long entityNo = null;
        String spaceName = null;
        String spaceType = null;

        String placeTitle = null;
        if (hp.getWorkStayEntity() != null) {
            placeNo = hp.getWorkStayEntity().getPlaceEntity().getNo();
            placeTitle = hp.getWorkStayEntity().getPlaceEntity().getTitle();
            entityNo = hp.getWorkStayEntity().getNo();
            spaceName = hp.getWorkStayEntity().getTitle();
            spaceType = hp.getWorkStayEntity().getPlaceEntity().getType();
        } else if (hp.getOfficeEntity() != null) {
            placeNo = hp.getOfficeEntity().getPlaceEntity().getNo();
            placeTitle = hp.getOfficeEntity().getPlaceEntity().getTitle();
            entityNo = hp.getOfficeEntity().getNo();
            spaceName = hp.getOfficeEntity().getTitle();
            spaceType = hp.getOfficeEntity().getPlaceEntity().getType();
        } else if (hp.getStationEntity() != null) {
            placeNo = hp.getStationEntity().getPlaceEntity().getNo();
            placeTitle = hp.getStationEntity().getPlaceEntity().getTitle();
            entityNo = hp.getStationEntity().getNo();
            spaceName = hp.getStationEntity().getTitle();
            spaceType = hp.getStationEntity().getPlaceEntity().getType();
        } else if (hp.getPlaceEntity() != null) {
            placeNo = hp.getPlaceEntity().getNo();
            placeTitle = hp.getPlaceEntity().getTitle();
            spaceName = hp.getPlaceEntity().getTitle();
            spaceType = hp.getPlaceEntity().getType();
        }

        return HostSpaceResDto.builder()
                .placeNo(placeNo)
                .entityNo(entityNo)
                .placeImg(placeImg)
                .placeTitle(placeTitle)
                .spaceName(spaceName)
                .spaceType(spaceType)
                .reservationCount(reservationCount)
                .build();
    }
}
