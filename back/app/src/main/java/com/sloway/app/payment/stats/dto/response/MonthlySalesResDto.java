package com.sloway.app.payment.stats.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MonthlySalesResDto {
    private String yearMonth;
    private Integer totalAmt;
    private Long payCount;
    private Integer avgAmt;
    private Integer refundAmt;
    private Integer netAmt;

    public static MonthlySalesResDto of(String yearMonth, Integer totalAmt, Long payCount, Integer refundAmt) {
        int avgAmt = payCount == 0 ? 0 : (int) (totalAmt / payCount);
        int netAmt = totalAmt - refundAmt;

        return MonthlySalesResDto.builder()
                .yearMonth(yearMonth)
                .totalAmt(totalAmt)
                .payCount(payCount)
                .avgAmt(avgAmt)
                .refundAmt(refundAmt)
                .netAmt(netAmt)
                .build();
    }
}
