package com.sloway.app.payment.stats.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Getter
@Builder
public class RefundStatResDto {

    private Integer refundCount;
    private BigDecimal refundAmt;
    private Integer refundRate;

    public static RefundStatResDto of(Integer refundCount, BigDecimal refundAmt, Long finalAmt) {
        int refundRate = finalAmt == 0 ? 0 : refundAmt.multiply(BigDecimal.valueOf(100))
                                             .divide(BigDecimal.valueOf(finalAmt), 0, RoundingMode.DOWN)
                                             .intValue();

        return RefundStatResDto.builder()
                .refundCount(refundCount)
                .refundAmt(refundAmt)
                .refundRate(refundRate)
                .build();
    }
}
