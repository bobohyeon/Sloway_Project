package com.sloway.app.reservation.rsvn.dto.request;

import com.sloway.app.reservation.rsvn.entity.RsvnEntity;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class RsvnReqDto {

    private Long officeNo;
    private Long stationNo;
    private Long workStayNo;
    private Integer count;
    private Integer amt;
    private String special;
    private LocalDateTime checkIn;
    private LocalDateTime checkOut;

    //service에서 공간타입 변환 후 사용하기
//    public RsvnEntity toEntity(){
//        return RsvnEntity.builder()
//                .officeNo(officeNo)
//                .stationNo(stationNo)
//                .workStayNo(workStayNo)
//                .count(count)
//                .amt(amt)
//                .special(special)
//                .checkIn(checkIn)
//                .checkOut(checkOut)
//                .build();
//    }
}
