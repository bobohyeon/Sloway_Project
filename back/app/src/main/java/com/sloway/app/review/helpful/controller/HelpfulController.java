package com.sloway.app.review.helpful.controller;

import com.sloway.app.auth.user.CustomUserDetails;
import com.sloway.app.review.helpful.dto.request.HelpfulReqDto;
import com.sloway.app.review.helpful.service.HelpfulService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/review/helpful")
@RequiredArgsConstructor
@RestController
public class HelpfulController {

    private final HelpfulService helpfulService;

    // 도움됨 등록
    @PostMapping
    public ResponseEntity<Void> save(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody HelpfulReqDto reqDto
    ) {
        helpfulService.save(userDetails.getMemberNo(), reqDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // 도움됨 취소
    @DeleteMapping("/{no}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long no
    ) {
        helpfulService.delete(userDetails.getMemberNo(), no);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    // 도움됨 카운트 조회
    @GetMapping("/{reviewNo}")
    public ResponseEntity<Long> countByReview(
            @PathVariable Long reviewNo
    ) {
        Long count = helpfulService.countByReview(reviewNo);
        return ResponseEntity.ok(count);
    }
}
