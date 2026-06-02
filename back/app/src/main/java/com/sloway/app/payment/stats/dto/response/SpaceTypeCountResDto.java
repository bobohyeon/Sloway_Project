package com.sloway.app.payment.stats.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SpaceTypeCountResDto {

    private String type;
    private Long count;

    public static SpaceTypeCountResDto of(String type, Long count) {
        return SpaceTypeCountResDto.builder()
                .type(type)
                .count(count)
                .build();
    }
}
