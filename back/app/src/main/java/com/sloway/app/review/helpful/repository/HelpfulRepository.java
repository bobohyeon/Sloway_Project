package com.sloway.app.review.helpful.repository;

import com.sloway.app.review.helpful.entity.HelpfulEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HelpfulRepository extends JpaRepository<HelpfulEntity, Long> {

    Optional<HelpfulEntity> findByUserNoAndReviewNo(Long memberNo, Long reviewNo);

    void deleteByUserNoAndReviewNo(Long memberNo, Long reviewNo);

    Integer countByReviewNo(Long reviewNo);
}
