package com.sloway.app.payment.settlement.settle.dto.response;

import com.sloway.app.payment.settlement.settle.common.SettleStatus;
import com.sloway.app.payment.settlement.settle.entity.SettleEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class SettleResDto {

    private Long no;
    private LocalDate settleStartDate;
    private LocalDate settleEndDate;
    private Long hostNo;
    private Integer totalAmt;
    private Integer feeAmt;
    private Integer refundAmt;
    private Integer payoutAmt;
    private SettleStatus status;
    private LocalDateTime settledAt;
    private LocalDateTime invoicedAt;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;


    public static SettleResDto from(SettleEntity entity) {
        return SettleResDto.builder()
                .no(entity.getNo())
                .settleStartDate(entity.getSettleStartDate())
                .settleEndDate(entity.getSettleEndDate())
                .hostNo(entity.getHostNo().getNo())
                .totalAmt(entity.getTotalAmt())
                .feeAmt(entity.getFeeAmt())
                .refundAmt(entity.getRefundAmt())
                .payoutAmt(entity.getPayoutAmt())
                .status(entity.getStatus())
                .settledAt(entity.getSettledAt())
                .invoicedAt(entity.getInvoicedAt())
                .createdAt(entity.getCreatedAt())
                .modifiedAt(entity.getModifiedAt())
                .build();
    }
}
