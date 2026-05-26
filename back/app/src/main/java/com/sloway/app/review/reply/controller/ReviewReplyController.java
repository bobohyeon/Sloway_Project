package com.sloway.app.review.reply.controller;

import com.sloway.app.auth.user.CustomUserDetails;
import com.sloway.app.review.reply.dto.request.ReviewReplyReqDto;
import com.sloway.app.review.reply.dto.response.ReviewReplyResDto;
import com.sloway.app.review.reply.service.ReviewReplyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/review/reply")
@RequiredArgsConstructor
@RestController
public class ReviewReplyController {

    private final ReviewReplyService reviewReplyService;

    // 답글 작성
    @PostMapping
    public ResponseEntity<Void> save(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody ReviewReplyReqDto reqDto
    ) {
        reviewReplyService.save(userDetails.getMemberNo(), reqDto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .build();
    }

    //답글 조회
    @GetMapping
    public ResponseEntity<List<ReviewReplyResDto>> findAll(@RequestParam Long reviewNo){
        List<ReviewReplyResDto> dtoList = reviewReplyService.findAll(reviewNo);
        return ResponseEntity.ok(dtoList);
    }

    // 답글 수정
    @PutMapping("/{no}")
    public ResponseEntity<Void> editReply(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long no,
            @RequestBody ReviewReplyReqDto reqDto
    ) {
        reviewReplyService.editReply(userDetails.getMemberNo(), no, reqDto.getContent());
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    // 답글 삭제
    @DeleteMapping("/{no}")
    public ResponseEntity<Void> deleteReply(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long no
    ) {
        reviewReplyService.deleteReply(userDetails.getMemberNo(), no);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
