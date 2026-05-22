package com.sloway.app.review.report.controller;

import com.sloway.app.auth.user.CustomUserDetails;
import com.sloway.app.review.report.dto.request.ReviewReportReqDto;
import com.sloway.app.review.report.dto.response.ReviewReportResDto;
import com.sloway.app.review.report.entity.ReportProcessStatus;
import com.sloway.app.review.report.service.ReviewReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/review/report")
@RequiredArgsConstructor
@RestController
public class ReviewReportController {

    private final ReviewReportService reviewReportService;

    // 신고 접수
    @PostMapping
    public ResponseEntity<Void> save(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody ReviewReportReqDto reqDto
    ) {
        reviewReportService.save(userDetails.getMemberNo(), reqDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // 신고 목록 조회 (관리자)
    @GetMapping
    public ResponseEntity<List<ReviewReportResDto>> findAll() {
        List<ReviewReportResDto> dtoList = reviewReportService.findAll();
        return ResponseEntity.ok(dtoList);
    }

    // 신고 처리 상태 변경 (관리자)
    @PutMapping("/{no}")
    public ResponseEntity<Void> processReport(
            @PathVariable Long no,
            @RequestParam ReportProcessStatus status
    ) {
        reviewReportService.processReport(no, status);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
