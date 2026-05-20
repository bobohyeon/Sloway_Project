package com.sloway.app.review.review.controller;

import com.sloway.app.auth.user.CustomUserDetails;
import com.sloway.app.review.review.dto.request.ReviewCreateReqDto;
import com.sloway.app.review.review.dto.request.ReviewEditReqDto;
import com.sloway.app.review.review.dto.response.ReviewResDto;
import com.sloway.app.review.review.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/review")
@RequiredArgsConstructor
@RestController
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Void> save(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody ReviewCreateReqDto dto
            ){
        reviewService.save(userDetails.getMemberNo(), dto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .build();
    }

    @GetMapping
    public ResponseEntity<List<ReviewResDto>> findAll(@RequestParam Long placeNo){
        List<ReviewResDto> dtoList = reviewService.findAll(placeNo);
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/{no}")
    public ResponseEntity<ReviewResDto> findOne(@PathVariable Long no){
        ReviewResDto dto = reviewService.findOne(no);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{no}")
    public ResponseEntity<Void> editReview(@PathVariable Long no, @RequestBody ReviewEditReqDto dto){
        reviewService.editReview(no, dto);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping("/{no}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long no){
        reviewService.deleteReview(no);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
