package com.sloway.app.review.helpful.dto.request;

import com.sloway.app.review.helpful.entity.HelpfulEntity;
import com.sloway.app.review.review.entity.ReviewEntity;
import lombok.Getter;

@Getter
public class HelpfulReqDto {

    private Long reviewNo;

    public HelpfulEntity toEntity(ReviewEntity reviewNo){
        return HelpfulEntity.builder()
                .reviewNo(reviewNo)
                .build();
    }
}
