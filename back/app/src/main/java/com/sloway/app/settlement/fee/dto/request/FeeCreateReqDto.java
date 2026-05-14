package com.sloway.app.settlement.fee.dto.request;

import com.sloway.app.settlement.fee.common.PlaceType;
import com.sloway.app.settlement.fee.entity.FeeEntity;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class FeeCreateReqDto {

    private PlaceType placeType;
    private Integer rate;
    private LocalDateTime startAt;
    private LocalDateTime endAt;

    public FeeEntity toEntity() {
        return FeeEntity.builder()
                .placeType(placeType)
                .rate(rate)
                .startAt(startAt)
                .endAt(endAt)
                .build();
    }
}
