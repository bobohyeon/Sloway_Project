package com.sloway.app.review.helpful.repository;

import com.sloway.app.member.entity.MemberEntity;
import com.sloway.app.review.helpful.entity.HelpfulEntity;
import com.sloway.app.review.review.entity.ReviewEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HelpfulRepository extends JpaRepository<HelpfulEntity, Long> {

    boolean existsByMemberNoAndReviewNo(MemberEntity memberNo, ReviewEntity reviewNo);

    Long countByReviewNo(ReviewEntity reviewNo);

}
