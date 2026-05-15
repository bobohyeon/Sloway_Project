package com.sloway.app.review.reply.dto.request;

import com.sloway.app.review.reply.entity.ReviewReplyEntity;
import lombok.Getter;

@Getter
public class ReviewReplyReqDto {

    private Long reviewNo;
    private String content;

    //service에서 ReviewEntity로 변환 후 사용하기
//    public ReviewReplyEntity toEntity(){
//        return ReviewReplyEntity.builder()
//                .reviewNo(reviewNo)
//                .content(content)
//                .build();
//    }
}
