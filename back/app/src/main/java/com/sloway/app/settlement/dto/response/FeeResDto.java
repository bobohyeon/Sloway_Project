package com.sloway.app.settlement.dto.response;

import com.sloway.app.settlement.common.PlaceType;
import com.sloway.app.settlement.entity.FeeEntity;
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
