package com.sloway.app.review.report.dto.request;

import com.sloway.app.review.report.entity.ReviewReportReasonType;
import lombok.Getter;

@Getter
public class ReviewReportReqDto {

    private Long reviewNo;
    private ReviewReportReasonType reasonType;
    private String reasonDetail;

    //service에서 ReviewReportEntity로 변환 후 사용하기
//    public ReviewReportEntity toEntity(){
//        return ReviewReportEntity.builder()
//                .reviewNo(reviewNo)
//                .reasonType(reasonType)
//                .reasonDetail(reasonDetail)
//                .build();
//    }
}
