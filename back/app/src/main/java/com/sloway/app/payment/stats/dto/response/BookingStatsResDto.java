package com.sloway.app.payment.stats.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class BookingStatsResDto {

    private Long total;
    private Long confirmed;
    private Long canceled;
    private Long completed;
    private List<MonthlyTrendResDto> trend;

    public static BookingStatsResDto of(Long total, Long confirmed, Long canceled, Long completed,
                                        List<MonthlyTrendResDto> trend) {
        return BookingStatsResDto.builder()
                .total(total)
                .confirmed(confirmed)
                .canceled(canceled)
                .completed(completed)
                .trend(trend)
                .build();
    }
}
