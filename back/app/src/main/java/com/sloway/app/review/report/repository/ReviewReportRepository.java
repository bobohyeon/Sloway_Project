package com.sloway.app.review.report.repository;

import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.review.report.entity.ReviewReportEntity;
import com.sloway.app.review.review.entity.ReviewEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewReportRepository extends JpaRepository<ReviewReportEntity, Long> {

    Boolean existsByMemberNoAndReviewNo(MemberEntity memberEntity, ReviewEntity reviewEntity);

}
