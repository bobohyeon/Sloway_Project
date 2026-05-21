package com.sloway.app.payment.refund.dto.request;

import com.sloway.app.payment.pay.entity.PayEntity;
import com.sloway.app.payment.refund.common.RefundReason;
import com.sloway.app.payment.refund.common.RefundStatus;
import com.sloway.app.payment.refund.entity.RefundEntity;
import com.sloway.app.reservation.rsvn.entity.RsvnEntity;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class RefundCreateReqDto {

    private Long payNo;
    private Long rsvnNo;
    private RefundReason refundReason;


    public RefundEntity toEntity(PayEntity payEntity, RsvnEntity rsvnEntity) {
        return RefundEntity.builder()
                .payNo(payEntity)
                .rsvnNo(rsvnEntity)
                .refundReason(refundReason)
                .requestedAt(LocalDateTime.now())
                .status(RefundStatus.REQUESTED)
                .build();
    }
}
