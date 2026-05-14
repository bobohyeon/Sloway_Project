package com.sloway.app.payment.pay.dto.response;

import com.sloway.app.payment.pay.common.PayMethod;
import com.sloway.app.payment.pay.common.PayStatus;
import com.sloway.app.payment.pay.entity.PayEntity;
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

    public static PayResDto from(PayEntity entity){
        return PayResDto.builder()
                .no(entity.getNo())
                .rsvnNo(entity.getRsvnNo())
                .ucNo(entity.getUcNo())
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
                .build();
    }
}
