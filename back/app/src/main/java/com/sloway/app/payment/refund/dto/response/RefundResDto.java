package com.sloway.app.payment.refund.dto.response;

import com.sloway.app.payment.refund.common.RefundRate;
import com.sloway.app.payment.refund.common.RefundReason;
import com.sloway.app.payment.refund.common.RefundStatus;
import com.sloway.app.payment.refund.entity.RefundEntity;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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

    public static RefundResDto from(RefundEntity entity) {
        return RefundResDto.builder()
                .no(entity.getNo())
                .payNo(entity.getPayNo().getNo())
                .rsvnNo(entity.getRsvnNo().getNo())
                .ucNo(entity.getUcNo() == null ? null : entity.getUcNo().getNo())
                .refundAmt(entity.getRefundAmt())
                .refundRate(entity.getRefundRate())
                .refundReason(entity.getRefundReason())
                .requestedAt(entity.getRequestedAt())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .modifiedAt(entity.getModifiedAt())
                .build();
    }
}
