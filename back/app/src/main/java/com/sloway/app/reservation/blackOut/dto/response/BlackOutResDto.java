package com.sloway.app.reservation.blackOut.dto.response;

import com.sloway.app.reservation.blackOut.entity.BlackOutEntity;
import com.sloway.app.reservation.blackOut.entity.BlackOutReasonType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class BlackOutResDto {

    private Long no;
    private Long entityNo;
    private String title;
    private String memo;
    private BlackOutReasonType reasonType;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime createdAt;

    public static BlackOutResDto from(BlackOutEntity entity){

        Long entityNo =null;

        if(entity.getOfficeNo() != null){ entityNo = entity.getOfficeNo().getNo();
        }else if(entity.getStationNo() != null){ entityNo = entity.getStationNo().getNo();
        }else if(entity.getWorkStayNo() != null){ entityNo = entity.getWorkStayNo().getNo();}

        return BlackOutResDto.builder()
                .no(entity.getNo())
                .entityNo(entityNo)
                .title(entity.getTitle())
                .memo(entity.getMemo())
                .reasonType(entity.getReasonType())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .startTime(entity.getStartTime())
                .endTime(entity.getEndTime())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
