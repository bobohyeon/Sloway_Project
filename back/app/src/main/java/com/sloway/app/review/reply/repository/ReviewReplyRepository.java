package com.sloway.app.review.reply.repository;

import com.sloway.app.reservation.rsvn.entity.RsvnEntity;
import com.sloway.app.review.reply.entity.ReviewReplyEntity;
import com.sloway.app.review.review.entity.ReviewEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewReplyRepository extends JpaRepository<ReviewReplyEntity, Long> {

    List<ReviewReplyEntity> findByReviewNoAndDelAtIsNull(ReviewEntity reviewNo);
    
}
