package com.sloway.app.payment.stats.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MonthlyTrendResDto {

    private String yearMonth;
    private Integer totalAmt;

    public static MonthlyTrendResDto of(String yearMonth, Integer totalAmt) {
        return MonthlyTrendResDto.builder()
                .yearMonth(yearMonth)
                .totalAmt(totalAmt)
                .build();
    }
}
