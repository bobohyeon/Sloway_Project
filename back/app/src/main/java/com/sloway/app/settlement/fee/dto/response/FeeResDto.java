package com.sloway.app.settlement.fee.dto.response;

import com.sloway.app.settlement.fee.common.PlaceType;
import com.sloway.app.settlement.fee.entity.FeeEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class FeeResDto {

    private Long no;
    private PlaceType placeType;
    private Integer rate;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private String delYn;

    public static FeeResDto from(FeeEntity entity) {
        return FeeResDto.builder()
                .no(entity.getNo())
                .placeType(entity.getPlaceType())
                .rate(entity.getRate())
                .startAt(entity.getStartAt())
                .endAt(entity.getEndAt())
                .delYn(entity.getDelYn())
                .build();
    }
}
