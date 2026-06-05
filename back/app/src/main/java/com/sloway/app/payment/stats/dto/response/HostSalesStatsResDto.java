package com.sloway.app.payment.stats.dto.response;


import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class HostSalesStatsResDto {

    private Long totalAmt;
    private Long payCount;
    private Long refundAmt;
    private Long avgAmt;
    private List<MonthlyTrendResDto> trend;

    // 금액 필드 Long — 공간별 월 매출이 int(약 21억)를 넘겨 음수 되는 것 방지
    public static HostSalesStatsResDto of(Long totalAmt, Long payCount, Long refundAmt, List<MonthlyTrendResDto> trend) {
        long avgAmt = payCount == 0 ? 0 : totalAmt / payCount;

        return HostSalesStatsResDto.builder()
                .totalAmt(totalAmt)
                .payCount(payCount)
                .avgAmt(avgAmt)
                .refundAmt(refundAmt)
                .trend(trend)
                .build();
    }



}
