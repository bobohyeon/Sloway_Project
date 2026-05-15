package com.sloway.app.review.review.dto.response;

import com.sloway.app.review.review.entity.ReviewEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ReviewResDto {

    private Long no;
    private Long rsvnNo;
    private Integer scoreTotal;
    private Integer scoreOffice;
    private Integer scoreAmenity;
    private Integer scoreFocus;
    private String content;
    private LocalDateTime createdAt;

    public static ReviewResDto from(ReviewEntity entity){
        return ReviewResDto.builder()
                .no(entity.getNo())
                .rsvnNo(entity.getRsvnNo().getNo())
                .scoreTotal(entity.getScoreTotal())
                .scoreOffice(entity.getScoreOffice())
                .scoreAmenity(entity.getScoreAmenity())
                .scoreFocus(entity.getScoreFocus())
                .content(entity.getContent())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
