package com.sloway.app.reservation.blackOut.dto.request;

import com.sloway.app.place.entity.office.OfficeEntity;
import com.sloway.app.place.entity.station.StationEntity;
import com.sloway.app.place.entity.workStay.WorkStayEntity;
import com.sloway.app.reservation.blackOut.entity.BlackOutEntity;
import com.sloway.app.reservation.blackOut.entity.BlackOutReasonType;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class BlackOutReqDto {

    private String title;
    private String memo;
    private BlackOutReasonType reasonType;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    public BlackOutEntity toEntity(OfficeEntity officeNo, StationEntity stationNo, WorkStayEntity workStayNo){
        return BlackOutEntity.builder()
                .officeNo(officeNo)
                .stationNo(stationNo)
                .workStayNo(workStayNo)
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
