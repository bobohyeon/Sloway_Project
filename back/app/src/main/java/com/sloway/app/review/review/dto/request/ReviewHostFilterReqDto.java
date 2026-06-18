package com.sloway.app.review.review.dto.request;

import com.sloway.app.review.review.dto.PeriodType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewHostFilterReqDto {

    private Long placeNo;
    private Long entityNo;    // 공간하위상세 번호 (office/station/workStay)
    private String spaceType; // 하위 공간 타입 (OFFICE, STATION, WORK_STAY)
    private Integer minScore;
    private PeriodType period;

}
