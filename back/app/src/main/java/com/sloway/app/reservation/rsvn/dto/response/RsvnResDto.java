package com.sloway.app.reservation.rsvn.dto.response;

import com.sloway.app.place.entity.place.ImgPlaceEntity;
import com.sloway.app.reservation.rsvn.entity.RsvnEntity;
import com.sloway.app.reservation.rsvn.entity.RsvnStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Comparator;

@Getter
@Builder
public class RsvnResDto {

    private Long no;
    private Long memberNo;
    private Long payNo;
    private String guestName;
    private Long officeNo;
    private Long stationNo;
    private Long workStayNo;
    private String spaceName;
    private String spaceType;
    private Integer count;
    private Integer amt;
    private String special;
    private LocalDateTime checkIn;
    private LocalDateTime checkOut;
    private RsvnStatus status;
    private LocalDateTime createdAt;

    private String thumbnailUrl;

    public static RsvnResDto from(RsvnEntity entity, Long payNo){
        String spaceName = null;
        String spaceType = null;
        String thumbnailUrl = null;

        if (entity.getOfficeNo() != null) {
            spaceName = entity.getOfficeNo().getPlaceEntity().getTitle();
            spaceType = entity.getOfficeNo().getPlaceEntity().getType();
            thumbnailUrl = entity.getOfficeNo().getPlaceEntity().getImages().stream()
                    .min(Comparator.comparingInt(ImgPlaceEntity::getSort))
                    .map(ImgPlaceEntity::getCurrentUrl)
                    .orElse(null);
        } else if (entity.getWorkStayNo() != null) {
            spaceName = entity.getWorkStayNo().getPlaceEntity().getTitle();
            spaceType = entity.getWorkStayNo().getPlaceEntity().getType();
            thumbnailUrl = entity.getWorkStayNo().getPlaceEntity().getImages().stream()
                    .min(Comparator.comparingInt(ImgPlaceEntity::getSort))
                    .map(ImgPlaceEntity::getCurrentUrl)
                    .orElse(null);
        } else if (entity.getStationNo() != null) {
            spaceName = entity.getStationNo().getPlaceEntity().getTitle();
            spaceType = entity.getStationNo().getPlaceEntity().getType();
            thumbnailUrl = entity.getStationNo().getPlaceEntity().getImages().stream()
                    .min(Comparator.comparingInt(ImgPlaceEntity::getSort))
                    .map(ImgPlaceEntity::getCurrentUrl)
                    .orElse(null);
        }


        return RsvnResDto.builder()
                .no(entity.getNo())
                .memberNo(entity.getMemberNo().getNo())
                .payNo(payNo)
                .guestName(entity.getMemberNo().getName())
                .officeNo(entity.getOfficeNo() != null ? entity.getOfficeNo().getNo() : null)
                .stationNo(entity.getStationNo() != null ? entity.getStationNo().getNo() : null)
                .workStayNo(entity.getWorkStayNo() != null ? entity.getWorkStayNo().getNo() : null)
                .spaceName(spaceName)
                .spaceType(spaceType)
                .thumbnailUrl(thumbnailUrl)
                .count(entity.getCount())
                .amt(entity.getAmt())
                .special(entity.getSpecial())
                .checkIn(entity.getCheckIn())
                .checkOut(entity.getCheckOut())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
