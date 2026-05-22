package com.sloway.app.review.report.dto.request;

import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.review.report.entity.ReviewReportEntity;
import com.sloway.app.review.report.entity.ReviewReportReasonType;
import com.sloway.app.review.review.entity.ReviewEntity;
import lombok.Getter;

@Getter
public class ReviewReportReqDto {

    private Long reviewNo;
    private ReviewReportReasonType reasonType;
    private String reasonDetail;

    //service에서 ReviewReportEntity로 변환 후 사용하기
    public ReviewReportEntity toEntity(ReviewEntity reviewNo, MemberEntity memberNo){
        return ReviewReportEntity.builder()
                .memberNo(memberNo)
                .reviewNo(reviewNo)
                .reasonType(reasonType)
                .reasonDetail(reasonDetail)
                .build();
    }
}
