package com.sloway.app.payment.settlement.fee.dto.request;

import com.sloway.app.payment.settlement.fee.common.PlaceType;
import com.sloway.app.payment.settlement.fee.entity.FeeEntity;
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
