package com.sloway.app.payment.stats.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MonthlySalesResDto {
    private String yearMonth;
    private Long totalAmt;
    private Long payCount;
    private Long avgAmt;
    private Long refundAmt;
    private Long netAmt;

    // 금액 필드는 Long — 월 매출이 수백억이라 int(약 21억) 오버플로우(음수) 방지
    public static MonthlySalesResDto of(String yearMonth, Long totalAmt, Long payCount, Long refundAmt) {
        long avgAmt = payCount == 0 ? 0 : totalAmt / payCount;
        long netAmt = totalAmt - refundAmt;

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
