package com.sloway.app.review.helpful.dto.response;

import com.sloway.app.review.helpful.entity.HelpfulEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class HelpfulResDto {

    private Long no;
    private Long memberNo;
    private Long reviewNo;
    private LocalDateTime createdAt;

    public static HelpfulResDto from(HelpfulEntity entity){
        return HelpfulResDto.builder()
                .no(entity.getNo())
                .memberNo(entity.getMemberNo().getNo())
                .reviewNo(entity.getReviewNo().getNo())
                .createdAt(entity.getCreatedAt())
                .build();
    }

}
