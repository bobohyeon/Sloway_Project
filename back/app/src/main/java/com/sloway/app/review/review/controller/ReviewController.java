package com.sloway.app.review.review.controller;

import com.sloway.app.review.review.service.ReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RequestMapping("/api/user/review")
@RequiredArgsConstructor
@RestController
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/{reviewNo}/helpful")
    public ResponseEntity<Void> helpfulToggle(@PathVariable Long reviewNo){
        reviewService.helpfulToggle(reviewNo);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/{reviewNo}/helpful")
    public ResponseEntity<Integer> helpfulCount(@PathVariable Long reviewNo){
        Integer count =  reviewService.helpfulCount(reviewNo);
        return ResponseEntity.ok(count);
    }
}
