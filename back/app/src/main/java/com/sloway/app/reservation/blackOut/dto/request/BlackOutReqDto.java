package com.sloway.app.reservation.blackOut.dto.request;

import com.sloway.app.place.entity.place.PlaceEntity;
import com.sloway.app.reservation.blackOut.entity.BlackOutEntity;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class BlackOutReqDto {

    private Long placeNo;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    //service에서 PlaceEntity 변환 후 사용하기
//    public BlackOutEntity toEntity(){
//        return BlackOutEntity.builder()
//                .placeNo(placeNo)
//                .startDate(startDate)
//                .endDate(endDate)
//                .startTime(startTime)
//                .endTime(endTime)
//                .build();
//    }
}
