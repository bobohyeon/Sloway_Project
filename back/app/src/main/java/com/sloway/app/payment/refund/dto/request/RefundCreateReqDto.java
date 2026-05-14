package com.sloway.app.payment.refund.dto.request;

import com.sloway.app.payment.refund.common.RefundReason;
import com.sloway.app.payment.refund.common.RefundStatus;
import com.sloway.app.payment.refund.entity.RefundEntity;
import lombok.Getter;

@Getter
public class RefundCreateReqDto {

    private Long payNo;
    private Long rsvnNo;
    private RefundReason refundReason;


    public RefundEntity toEntity() {
        return RefundEntity.builder()
                .payNo(payNo)
                .rsvnNo(rsvnNo)
                .refundReason(refundReason)
                .status(RefundStatus.REQUESTED)
                .build();
    }
}
