package com.sloway.app.review.review.controller;

import com.sloway.app.auth.user.CustomUserDetails;
import com.sloway.app.review.review.dto.request.ReviewCreateReqDto;
import com.sloway.app.review.review.dto.request.ReviewEditReqDto;
import com.sloway.app.review.review.dto.response.ReviewResDto;
import com.sloway.app.review.review.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RequestMapping("/api/review")
@RequiredArgsConstructor
@RestController
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> save(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestPart("dto") ReviewCreateReqDto dto,
            @RequestPart(value = "images",required = false) List<MultipartFile> images
            ){
        reviewService.save(userDetails.getMemberNo(), dto, images);
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
    public ResponseEntity<Void> editReview(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long no,
            @RequestBody ReviewEditReqDto dto
    ){
        reviewService.editReview(userDetails.getMemberNo(), no, dto);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping("/{no}")
    public ResponseEntity<Void> deleteReview(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long no
    ){
        reviewService.deleteReview(userDetails.getMemberNo(), no);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
