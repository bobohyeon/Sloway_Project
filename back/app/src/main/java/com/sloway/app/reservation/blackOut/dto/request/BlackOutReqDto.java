package com.sloway.app.reservation.blackOut.dto.request;

import com.sloway.app.place.entity.place.PlaceEntity;
import com.sloway.app.reservation.blackOut.entity.BlackOutEntity;
import com.sloway.app.reservation.blackOut.entity.BlackOutReasonType;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class BlackOutReqDto {

    private Long placeNo;
    private String title;
    private String memo;
    private BlackOutReasonType reasonType;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    public BlackOutEntity toEntity(PlaceEntity placeNo){
        return BlackOutEntity.builder()
                .placeNo(placeNo)
                .title(title)
                .memo(memo)
                .reasonType(reasonType)
                .startDate(startDate)
                .endDate(endDate)
                .startTime(startTime)
                .endTime(endTime)
                .build();
    }
}
