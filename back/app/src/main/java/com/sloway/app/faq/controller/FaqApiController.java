package com.sloway.app.faq.controller;

import com.sloway.app.auth.user.CustomUserDetails;
import com.sloway.app.faq.dto.request.FaqWriteReqDto;
import com.sloway.app.faq.dto.response.user.FaqListResDto;
import com.sloway.app.faq.service.FaqService;
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
@RequestMapping("api/faq")
@RequiredArgsConstructor
@Slf4j
public class FaqApiController {

    private final FaqService faqService;

    @GetMapping
    public ResponseEntity<Page<FaqListResDto>> findAll(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(faqService.findAll(category, keyword, pageable));
    }

    @GetMapping("{id}")
    public ResponseEntity<FaqListResDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(faqService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Void> create(
            @RequestBody FaqWriteReqDto reqDto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        faqService.create(reqDto, userDetails.getMemberNo());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("{id}")
    public ResponseEntity<Void> update(
            @PathVariable Long id,
            @RequestBody FaqWriteReqDto reqDto) {
        faqService.update(id, reqDto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        faqService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
