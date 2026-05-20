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
}
