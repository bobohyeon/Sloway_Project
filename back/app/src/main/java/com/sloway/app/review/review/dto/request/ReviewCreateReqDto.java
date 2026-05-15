package com.sloway.app.review.review.dto.request;

import lombok.Getter;

@Getter
public class ReviewCreateReqDto {

    private Long rsvnNo;
    private Integer scoreTotal;
    private Integer scoreOffice;
    private Integer scoreAmenity;
    private Integer scoreFocus;
    private String content;

    //service에서 RsvnEntity로 변환 후 사용하기
//    public ReviewEntity toEntity(){
//        return ReviewEntity.builder()
//                .rsvnNo(rsvnNo)
//                .scoreTotal(scoreTotal)
//                .scoreOffice(scoreOffice)
//                .scoreAmenity(scoreAmenity)
//                .scoreFocus(scoreFocus)
//                .content(content)
//                .build();
//    }
}
