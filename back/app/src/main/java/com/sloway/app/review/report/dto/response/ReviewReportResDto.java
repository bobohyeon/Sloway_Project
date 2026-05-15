package com.sloway.app.review.report.dto.response;

import com.sloway.app.review.report.entity.ReportProcessStatus;
import com.sloway.app.review.report.entity.ReviewReportEntity;
import com.sloway.app.review.report.entity.ReviewReportReasonType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ReviewReportResDto {

    private Long no;
    private Long memberNo;
    private Long reviewNo;
    private ReviewReportReasonType reasonType;
    private String reasonDetail;
    private LocalDateTime createdAt;
    private LocalDateTime processAt;
    private ReportProcessStatus processStatus;


    public static ReviewReportResDto from(ReviewReportEntity entity){
        return ReviewReportResDto.builder()
                .no(entity.getNo())
                .memberNo(entity.getMemberNo().getNo())
                .reviewNo(entity.getReviewNo().getNo())
                .reasonType(entity.getReasonType())
                .reasonDetail(entity.getReasonDetail())
                .createdAt(entity.getCreatedAt())
                .processAt(entity.getProcessAt())
                .processStatus(entity.getProcessStatus())
                .build();
    }
}
