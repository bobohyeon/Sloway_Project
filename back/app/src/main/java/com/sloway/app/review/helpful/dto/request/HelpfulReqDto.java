package com.sloway.app.review.helpful.dto.request;

import com.sloway.app.review.helpful.entity.HelpfulEntity;
import lombok.Getter;

@Getter
public class HelpfulReqDto {

    private Long reviewNo;

    //service에서 HelpfulEntity로 변환 후 사용하기
//    public HelpfulEntity toEntity(){
//        return HelpfulEntity.builder()
//                .reviewNo(reviewNo)
//                .build();
//    }
}
