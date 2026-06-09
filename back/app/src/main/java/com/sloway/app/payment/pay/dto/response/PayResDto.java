package com.sloway.app.payment.pay.dto.response;

import com.sloway.app.payment.pay.common.PayMethod;
import com.sloway.app.payment.pay.common.PayStatus;
import com.sloway.app.payment.pay.entity.PayEntity;
import com.sloway.app.reservation.rsvn.entity.RsvnEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class PayResDto {

    private Long no;
    private Long rsvnNo;
    private Long ucNo;
    private String tid;
    private PayMethod method;
    private PayStatus status;
    private Integer baseAmt;
    private Integer addAmt;
    private Integer usedPoint;
    private Integer dcAmt;
    private Integer finalAmt;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
    private LocalDateTime approvedAt;

    // 예약 → 회원·공간 join (단건 상세 표시용). 회원/공간 도메인이 채워져 연동 가능
    private String memberName;   // 결제한 회원 이름
    private String spaceName;    // 예약 공간명(office/station/work 중)
    private LocalDateTime checkIn;
    private LocalDateTime checkOut;

    public static PayResDto from(PayEntity entity) {
        RsvnEntity rsvn = entity.getRsvnNo();
        return PayResDto.builder()
                .no(entity.getNo())
                .rsvnNo(rsvn.getNo())
                .ucNo(entity.getUcNo() == null ? null : entity.getUcNo().getNo())
                .tid(entity.getTid())
                .method(entity.getMethod())
                .status(entity.getStatus())
                .baseAmt(entity.getBaseAmt())
                .addAmt(entity.getAddAmt())
                .usedPoint(entity.getUsedPoint())
                .dcAmt(entity.getDcAmt())
                .finalAmt(entity.getFinalAmt())
                .createdAt(entity.getCreatedAt())
                .modifiedAt(entity.getModifiedAt())
                .approvedAt(entity.getApprovedAt())
                .memberName(rsvn.getMemberNo().getName())
                .spaceName(resolveSpaceName(rsvn))
                .checkIn(rsvn.getCheckIn())
                .checkOut(rsvn.getCheckOut())
                .build();
    }

    // 예약에 연결된 공간 타입(office/station/work) 중 채워진 것의 title 반환
    private static String resolveSpaceName(RsvnEntity rsvn) {
        if (rsvn.getOfficeNo() != null) return rsvn.getOfficeNo().getTitle();
        if (rsvn.getStationNo() != null) return rsvn.getStationNo().getTitle();
        if (rsvn.getWorkStayNo() != null) return rsvn.getWorkStayNo().getTitle();
        return null;
    }
}
