package com.sloway.app.review.review.repository;

import com.sloway.app.review.helpful.entity.HelpfulEntity;
import com.sloway.app.review.review.entity.ReviewEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {

}
