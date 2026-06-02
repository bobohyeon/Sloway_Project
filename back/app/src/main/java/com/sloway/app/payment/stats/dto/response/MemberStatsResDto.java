package com.sloway.app.payment.stats.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class MemberStatsResDto {

    private Long total;
    private Long newSignup;
    private Long active;
    private Long withdrawn;
    private List<MonthlyTrendResDto> trend;

    public static MemberStatsResDto of(Long total, Long newSignup, Long active, Long withdrawn,
                                       List<MonthlyTrendResDto> trend) {
        return MemberStatsResDto.builder()
                .total(total)
                .newSignup(newSignup)
                .active(active)
                .withdrawn(withdrawn)
                .trend(trend)
                .build();
    }
}
