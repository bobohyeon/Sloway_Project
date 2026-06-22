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
    private Integer finalAmt;   // PAY 최종 결제액 (포인트·쿠폰 적용 후)
    private Integer usedPoint;  // PAY 사용 포인트
    private Integer dcAmt;      // PAY 쿠폰 할인액
    private String special;
    private LocalDateTime checkIn;
    private LocalDateTime checkOut;
    private RsvnStatus status;
    private LocalDateTime createdAt;

    private String thumbnailUrl;

    private boolean hasReview;

    private String roomName;
    private boolean refunded;



    public static RsvnResDto from(RsvnEntity entity, Long payNo){
        return from(entity, payNo, false, false);
    }

    public static RsvnResDto from(RsvnEntity entity, Long payNo, boolean hasReview){
        return from(entity, payNo, hasReview, false);
    }

    public static RsvnResDto from(RsvnEntity entity, Long payNo,
                                  boolean hasReview, boolean refunded){
        return from(entity, payNo, null, null, null, hasReview, refunded);
    }

    // PAY 결제 정보(finalAmt/usedPoint/dcAmt)까지 매핑 — 결제 안 된 예약은 null
    public static RsvnResDto from(RsvnEntity entity, Long payNo,
                                  Integer finalAmt, Integer usedPoint, Integer dcAmt,
                                  boolean hasReview, boolean refunded){
        String spaceName = null;
        String spaceType = null;
        String thumbnailUrl = null;
        String roomName = null;


        if (entity.getOfficeNo() != null) {
            spaceName = entity.getOfficeNo().getPlaceEntity().getTitle();
            spaceType = entity.getOfficeNo().getPlaceEntity().getType();
            roomName = entity.getOfficeNo().getTitle();
            thumbnailUrl = entity.getOfficeNo().getPlaceEntity().getImages().stream()
                    .min(Comparator.comparing(ImgPlaceEntity::getSort, Comparator.nullsLast(Integer::compareTo)))
                    .map(ImgPlaceEntity::getCurrentUrl)
                    .orElse(null);
        } else if (entity.getWorkStayNo() != null) {
            spaceName = entity.getWorkStayNo().getPlaceEntity().getTitle();
            spaceType = entity.getWorkStayNo().getPlaceEntity().getType();
            roomName = entity.getWorkStayNo().getTitle();
            thumbnailUrl = entity.getWorkStayNo().getPlaceEntity().getImages().stream()
                    .min(Comparator.comparing(ImgPlaceEntity::getSort, Comparator.nullsLast(Integer::compareTo)))
                    .map(ImgPlaceEntity::getCurrentUrl)
                    .orElse(null);
        } else if (entity.getStationNo() != null) {
            spaceName = entity.getStationNo().getPlaceEntity().getTitle();
            spaceType = entity.getStationNo().getPlaceEntity().getType();
            roomName = entity.getStationNo().getTitle();
            thumbnailUrl = entity.getStationNo().getPlaceEntity().getImages().stream()
                    .min(Comparator.comparing(ImgPlaceEntity::getSort, Comparator.nullsLast(Integer::compareTo)))
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
                .finalAmt(finalAmt)
                .usedPoint(usedPoint)
                .dcAmt(dcAmt)
                .special(entity.getSpecial())
                .checkIn(entity.getCheckIn())
                .checkOut(entity.getCheckOut())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .hasReview(hasReview)
                .roomName(roomName)
                .refunded(refunded)
                .build();
    }
}
