package com.sloway.app.payment.refund.dto.request;

import com.sloway.app.payment.pay.entity.PayEntity;
import com.sloway.app.payment.refund.common.RefundReason;
import com.sloway.app.payment.refund.common.RefundStatus;
import com.sloway.app.payment.refund.entity.RefundEntity;
import com.sloway.app.reservation.rsvn.entity.RsvnEntity;
import lombok.Getter;

@Getter
public class RefundCreateReqDto {

    private Long payNo;
    private Long rsvnNo;
    private RefundReason refundReason;


    public RefundEntity toEntity(PayEntity payEntity, RsvnEntity rsvnEntity) {
        return RefundEntity.builder()
                .payNo(payEntity)
                .rsvnNo(rsvnEntity)
                .refundReason(refundReason)
                .status(RefundStatus.REQUESTED)
                .build();
    }
}
