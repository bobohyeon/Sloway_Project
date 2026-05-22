package com.sloway.app.review.report.service;

import com.sloway.app.common.exception.CustomException;
import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.member.repository.MemberRepository;
import com.sloway.app.reservation.RsvnErrorCode;
import com.sloway.app.review.ReviewErrorCode;
import com.sloway.app.review.report.dto.request.ReviewReportReqDto;
import com.sloway.app.review.report.dto.response.ReviewReportResDto;
import com.sloway.app.review.report.entity.ReportProcessStatus;
import com.sloway.app.review.report.entity.ReviewReportEntity;
import com.sloway.app.review.report.repository.ReviewReportRepository;
import com.sloway.app.review.review.entity.ReviewEntity;
import com.sloway.app.review.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class ReviewReportService {

    private final ReviewReportRepository reviewReportRepository;
    private final ReviewRepository reviewRepository;
    private final MemberRepository memberRepository;

    // 신고 접수
    @Transactional
    public void save(Long memberNo, ReviewReportReqDto dto) {
        MemberEntity member = memberRepository.findById(memberNo)
                .orElseThrow(()->new CustomException(RsvnErrorCode.MEMBER_NOT_FOUND));
        ReviewEntity review = reviewRepository.findById(dto.getReviewNo())
                .orElseThrow(()->new CustomException(ReviewErrorCode.REVIEW_NOT_FOUND));

        boolean isDone = reviewReportRepository.existsByMemberNoAndReviewNo(member,review);

        if(isDone){
            throw new CustomException(ReviewErrorCode.ALREADY_REPORT);
        }
        reviewReportRepository.save(dto.toEntity(review, member));
    }

    // 신고 목록 조회 (관리자)
    public List<ReviewReportResDto> findAll() {
        return reviewReportRepository.findAll()
                .stream()
                .map(ReviewReportResDto::from)
                .toList();
    }

    // 신고 처리 상태 변경 (관리자)
    @Transactional
    public void processReport(Long no, ReportProcessStatus status) {
        ReviewReportEntity reviewReport = reviewReportRepository.findById(no)
                .orElseThrow(()-> new CustomException(ReviewErrorCode.REPORT_NOT_FOUND));

        reviewReport.processUpdate(status);
    }
}
