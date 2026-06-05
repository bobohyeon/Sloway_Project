package com.sloway.app.payment.stats.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MonthlyTrendResDto {

    private String yearMonth;
    private Long totalAmt;   // 월 매출/건수 — int 오버플로우 방지로 Long

    public static MonthlyTrendResDto of(String yearMonth, Long totalAmt) {
        return MonthlyTrendResDto.builder()
                .yearMonth(yearMonth)
                .totalAmt(totalAmt)
                .build();
    }
}
