package com.sloway.app.review.review.dto.request;

import com.sloway.app.reservation.rsvn.entity.RsvnEntity;
import com.sloway.app.review.review.entity.ReviewEntity;
import lombok.Getter;

@Getter
public class ReviewCreateReqDto {

    private Long rsvnNo;
    private Integer scoreTotal;
    private Integer scoreOffice;
    private Integer scoreAmenity;
    private Integer scoreFocus;
    private String content;

    public ReviewEntity toEntity(RsvnEntity rsvnNo){
        return ReviewEntity.builder()
                .rsvnNo(rsvnNo)
                .scoreTotal(scoreTotal)
                .scoreOffice(scoreOffice)
                .scoreAmenity(scoreAmenity)
                .scoreFocus(scoreFocus)
                .content(content)
                .build();
    }
}
