package com.sloway.app.review.review.dto.request;

import com.sloway.app.review.review.dto.PeriodType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewHostFilterReqDto {

    private Long placeNo;
    private Integer minScore;
    private PeriodType period;

}
