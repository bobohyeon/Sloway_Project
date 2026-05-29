package com.sloway.app.inquiry.controller;

import com.sloway.app.auth.user.CustomUserDetails;
import com.sloway.app.inquiry.dto.request.admin.InquiryReplyCreateReqDto;
import com.sloway.app.inquiry.dto.request.user.InquiryCreateReqDto;
import com.sloway.app.inquiry.dto.response.admin.AdminInquiryDetailResDto;
import com.sloway.app.inquiry.dto.response.admin.AdminInquiryListResDto;
import com.sloway.app.inquiry.dto.response.user.MyInquiryDetailResDto;
import com.sloway.app.inquiry.dto.response.user.MyInquiryListResDto;
import com.sloway.app.inquiry.service.InquiryReplyService;
import com.sloway.app.inquiry.service.InquiryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/inquiry")
@RequiredArgsConstructor
@Slf4j
public class InquiryApiController {

    private final InquiryService inquiryService;
    private final InquiryReplyService replyService;

    // 사용자: 문의 등록

    @PostMapping
    public ResponseEntity<Void> create(
            @RequestBody InquiryCreateReqDto reqDto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        inquiryService.create(reqDto, userDetails.getMemberNo());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // 사용자: 내 문의 목록 / 상세

    @GetMapping("/my")
    public ResponseEntity<Page<MyInquiryListResDto>> findMyList(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PageableDefault(size = 10, sort = "createdAt",
                    direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(inquiryService.findMyInquiries(userDetails.getMemberNo(), pageable));
    }

    @GetMapping("/my/{id}")
    public ResponseEntity<MyInquiryDetailResDto> findMyDetail(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(inquiryService.findMyInquiryById(id, userDetails.getMemberNo()));
    }

    // 사용자: 문의 수정 / 삭제 (PENDING 상태, 작성자만)

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(
            @PathVariable Long id,
            @RequestBody InquiryCreateReqDto reqDto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        inquiryService.update(id, reqDto, userDetails.getMemberNo());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        inquiryService.delete(id, userDetails.getMemberNo());
        return ResponseEntity.noContent().build();
    }

    // 관리자: 전체 목록 / 상세

    @GetMapping
    public ResponseEntity<Page<AdminInquiryListResDto>> findAllForAdmin(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 10, sort = "createdAt",
                    direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(inquiryService.findAllForAdmin(status, category, keyword, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminInquiryDetailResDto> findByIdForAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(inquiryService.findByIdForAdmin(id));
    }

    // 관리자: 답변 등록 / 수정 / 삭제

    @PostMapping("/{id}/reply")
    public ResponseEntity<Void> createReply(
            @PathVariable Long id,
            @RequestBody InquiryReplyCreateReqDto reqDto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        replyService.createReply(id, reqDto, userDetails.getMemberNo());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{id}/reply")
    public ResponseEntity<Void> updateReply(
            @PathVariable Long id,
            @RequestBody InquiryReplyCreateReqDto reqDto) {
        replyService.updateReply(id, reqDto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/reply")
    public ResponseEntity<Void> deleteReply(@PathVariable Long id) {
        replyService.deleteReply(id);
        return ResponseEntity.noContent().build();
    }
}
