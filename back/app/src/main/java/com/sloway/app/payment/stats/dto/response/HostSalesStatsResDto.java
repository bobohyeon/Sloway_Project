package com.sloway.app.payment.stats.dto.response;


import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class HostSalesStatsResDto {

    private Integer totalAmt;
    private Long payCount;
    private Integer refundAmt;
    private Integer avgAmt;
    private List<MonthlyTrendResDto> trend;

    public static HostSalesStatsResDto of(Integer totalAmt, Long payCount, Integer refundAmt,List<MonthlyTrendResDto> trend) {
        int avgAmt = payCount == 0 ? 0 : (int) (totalAmt / payCount);

        return HostSalesStatsResDto.builder()
                .totalAmt(totalAmt)
                .payCount(payCount)
                .avgAmt(avgAmt)
                .refundAmt(refundAmt)
                .trend(trend)
                .build();
    }



}
