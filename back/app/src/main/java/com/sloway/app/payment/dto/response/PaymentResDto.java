package com.sloway.app.payment.dto.response;

import com.sloway.app.payment.common.PaymentMethod;
import com.sloway.app.payment.common.PaymentStatus;
import com.sloway.app.payment.entity.PaymentEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class PaymentResDto {

    private Long no;
    private Long rsvnNo;
    private Long ucNo;
    private String tid;
    private PaymentMethod method;
    private PaymentStatus status;
    private Integer baseAmt;
    private Integer addAmt;
    private Integer usedPoint;
    private Integer dcAmt;
    private Integer finalAmt;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
    private LocalDateTime approvedAt;

    public static PaymentResDto from(PaymentEntity entity){
        return PaymentResDto.builder()
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
