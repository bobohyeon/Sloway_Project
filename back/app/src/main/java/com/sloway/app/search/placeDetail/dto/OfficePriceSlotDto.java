package com.sloway.app.search.placeDetail.dto;

import com.sloway.app.place.entity.office.OfficePeriodEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@AllArgsConstructor
@Builder
@Getter
public class OfficePriceSlotDto {

    private LocalDateTime startTime;
    private int price;
    private String dayOfWeek;
    private LocalDateTime exceptionStartDate;
    private LocalDateTime exceptionEndDate;

    public static OfficePriceSlotDto from(OfficePeriodEntity entity){
        return OfficePriceSlotDto.builder()
                .startTime(entity.getStartTime())
                .price(entity.getPrice())
                .dayOfWeek(entity.getDayOfWeek())
                .exceptionStartDate(entity.getExceptionStartDate())
                .exceptionEndDate(entity.getExceptionEndDate())
                .build()
                ;
    }
}
