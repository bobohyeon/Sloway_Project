package com.sloway.app.review.reply.controller;

import com.sloway.app.auth.user.CustomUserDetails;
import com.sloway.app.review.review.dto.request.ReviewHostFilterReqDto;
import com.sloway.app.review.review.dto.response.ReviewResDto;
import com.sloway.app.review.reply.service.ReviewReplyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/host/reply/reviews")
public class HostReplyController {

    private final ReviewReplyService reviewReplyService;

    // 호스트용 리뷰 목록 필터 조회
   @GetMapping
    public ResponseEntity<List<ReviewResDto>> findReviewsByHost(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @ModelAttribute ReviewHostFilterReqDto filterDto
    ) {
       List<ReviewResDto> dtoList = reviewReplyService.findReviewsByHost(userDetails.getMemberNo(), filterDto);
        return ResponseEntity.ok(dtoList);
    }
}
