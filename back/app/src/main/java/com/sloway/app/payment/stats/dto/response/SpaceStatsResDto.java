package com.sloway.app.payment.stats.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class SpaceStatsResDto {

    private Long total;
    private Long newReg;
    private Long active;
    private Long pending;
    private List<SpaceTypeCountResDto> byType;

    public static SpaceStatsResDto of(Long total, Long newReg, Long active, Long pending,
                                      List<SpaceTypeCountResDto> byType) {
        return SpaceStatsResDto.builder()
                .total(total)
                .newReg(newReg)
                .active(active)
                .pending(pending)
                .byType(byType)
                .build();
    }
}
