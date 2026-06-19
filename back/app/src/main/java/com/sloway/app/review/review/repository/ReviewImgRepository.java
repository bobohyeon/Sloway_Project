package com.sloway.app.review.review.repository;

import com.sloway.app.review.review.entity.ReviewEntity;
import com.sloway.app.review.review.entity.ReviewImgEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewImgRepository extends JpaRepository<ReviewImgEntity, Long> {
    List<ReviewImgEntity> findByReviewNo(ReviewEntity reviewNo);
}
