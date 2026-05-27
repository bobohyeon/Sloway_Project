package com.sloway.app.review.review.controller;

import com.sloway.app.review.review.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/review")
public class AdminReviewController {

    private final ReviewService reviewService;

    // 관리자 리뷰 삭제
    @DeleteMapping("/{no}")
    public ResponseEntity<Void> adminDeleteReview(@PathVariable Long no) {
        reviewService.adminDeleteReview(no);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
