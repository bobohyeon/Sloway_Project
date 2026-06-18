package com.sloway.app.payment.refund.dto.response;

import com.sloway.app.payment.refund.common.RefundRate;
import com.sloway.app.payment.refund.common.RefundReason;
import com.sloway.app.payment.refund.common.RefundStatus;
import com.sloway.app.payment.refund.entity.RefundEntity;
import com.sloway.app.place.entity.office.ImgOfficeEntity;
import com.sloway.app.place.entity.station.ImgStationEntity;
import com.sloway.app.place.entity.workStay.ImgWorkStayEntity;
import com.sloway.app.reservation.rsvn.entity.RsvnEntity;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Comparator;

@Getter
@Builder
public class RefundResDto {

    private Long no;
    private Long payNo;
    private Long rsvnNo;
    private Long ucNo;
    private BigDecimal refundAmt;
    private RefundRate refundRate;
    private RefundReason refundReason;
    private LocalDateTime requestedAt;
    private RefundStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;

    // 예약 → 회원·공간 join (단건 상세 표시용). 회원/공간 도메인이 채워져 연동 가능
    private String memberName;   // 환불 요청 회원 이름
    private String spaceName;    // 예약 공간명(office/station/work 중)
    private String thumbnail;    // 예약 공간 대표 썸네일 URL(sort 최소 이미지)
    private LocalDateTime checkIn;
    private LocalDateTime checkOut;

    public static RefundResDto from(RefundEntity entity) {
        RsvnEntity rsvn = entity.getRsvnNo();
        return RefundResDto.builder()
                .no(entity.getNo())
                .payNo(entity.getPayNo().getNo())
                .rsvnNo(rsvn.getNo())
                .ucNo(entity.getUcNo() == null ? null : entity.getUcNo().getNo())
                .refundAmt(entity.getRefundAmt())
                .refundRate(entity.getRefundRate())
                .refundReason(entity.getRefundReason())
                .requestedAt(entity.getRequestedAt())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .modifiedAt(entity.getModifiedAt())
                .memberName(rsvn.getMemberNo().getName())
                .spaceName(resolveSpaceName(rsvn))
                .thumbnail(resolveThumbnail(rsvn))
                .checkIn(rsvn.getCheckIn())
                .checkOut(rsvn.getCheckOut())
                .build();
    }

    // 예약 공간명 — "상위 공간(Place) - 공간타입명" 형식 (예: "콘레드 - 킹 디럭스 코너 스위트")
    private static String resolveSpaceName(RsvnEntity rsvn) {
        if (rsvn.getOfficeNo() != null) {
            return rsvn.getOfficeNo().getPlaceEntity().getTitle() + " - " + rsvn.getOfficeNo().getTitle();
        }
        if (rsvn.getStationNo() != null) {
            return rsvn.getStationNo().getPlaceEntity().getTitle() + " - " + rsvn.getStationNo().getTitle();
        }
        if (rsvn.getWorkStayNo() != null) {
            return rsvn.getWorkStayNo().getPlaceEntity().getTitle() + " - " + rsvn.getWorkStayNo().getTitle();
        }
        return null;
    }

    // 예약 공간의 대표 썸네일 — 채워진 공간 타입의 images 중 sort 최소(첫 번째) 이미지 URL
    private static String resolveThumbnail(RsvnEntity rsvn) {
        if (rsvn.getOfficeNo() != null) {
            return rsvn.getOfficeNo().getImages().stream()
                    .min(Comparator.comparing(ImgOfficeEntity::getSort))
                    .map(ImgOfficeEntity::getCurrentUrl).orElse(null);
        }
        if (rsvn.getStationNo() != null) {
            return rsvn.getStationNo().getImages().stream()
                    .min(Comparator.comparing(ImgStationEntity::getSort))
                    .map(ImgStationEntity::getCurrentUrl).orElse(null);
        }
        if (rsvn.getWorkStayNo() != null) {
            return rsvn.getWorkStayNo().getImages().stream()
                    .min(Comparator.comparing(ImgWorkStayEntity::getSort))
                    .map(ImgWorkStayEntity::getCurrentUrl).orElse(null);
        }
        return null;
    }
}
