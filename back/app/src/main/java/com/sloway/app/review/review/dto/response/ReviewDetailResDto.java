package com.sloway.app.review.review.dto.response;

import com.sloway.app.review.review.entity.ReviewEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class ReviewDetailResDto {

    private Integer scoreTotal;
    private Integer scoreOffice;
    private Integer scoreAmenity;
    private Integer scoreFocus;
    private String content;
    private List<String> imgUrls;
    private Integer helpfulCount;
    private String hostReply;
    private LocalDateTime createdAt;


    public static ReviewDetailResDto from(
            ReviewEntity entity,
            List<String> imgUrls,
            Integer helpfulCount,
            String hostReply
            ){
        return ReviewDetailResDto.builder()
                .scoreTotal(entity.getScoreTotal())
                .scoreOffice(entity.getScoreOffice())
                .scoreAmenity(entity.getScoreAmenity())
                .scoreFocus(entity.getScoreFocus())
                .content(entity.getContent())
                .imgUrls(imgUrls)
                .helpfulCount(helpfulCount)
                .hostReply(hostReply)
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
