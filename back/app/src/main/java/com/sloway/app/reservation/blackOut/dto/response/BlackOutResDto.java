package com.sloway.app.reservation.blackOut.dto.response;

import com.sloway.app.reservation.blackOut.entity.BlackOutEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class BlackOutResDto {

    private Long no;
    private Long placeNo;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime createdAt;

    public static BlackOutResDto from(BlackOutEntity entity){
        return BlackOutResDto.builder()
                .no(entity.getNo())
                .placeNo(entity.getPlaceNo().getNo())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .startTime(entity.getStartTime())
                .endTime(entity.getEndTime())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
