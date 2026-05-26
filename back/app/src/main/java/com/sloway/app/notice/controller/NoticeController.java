package com.sloway.app.notice.controller;

import com.sloway.app.notice.dto.request.NoticeWriteReqDto;
import com.sloway.app.notice.dto.response.NoticeDetailResDto;
import com.sloway.app.notice.dto.response.NoticeListResDto;
import com.sloway.app.notice.service.NoticeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/notice")
@RequiredArgsConstructor
@Slf4j
public class NoticeController {

    private final NoticeService noticeService;

    @GetMapping
    public ResponseEntity<Page<NoticeListResDto>> findAll(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "all") String status,
            @PageableDefault(size = 10, sort = "createdAt",
                    direction = Sort.Direction.DESC) Pageable pageable) {

        return ResponseEntity.ok(noticeService.findAll(category, keyword, status, pageable));
    }

    @GetMapping("{id}")
    public ResponseEntity<NoticeDetailResDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(noticeService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Void> write(@RequestBody NoticeWriteReqDto reqDto) {
        noticeService.write(reqDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("{id}")
    public ResponseEntity<Void> update(@PathVariable Long id,
                                       @RequestBody NoticeWriteReqDto reqDto) {
        noticeService.update(id, reqDto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        noticeService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAll(@RequestBody List<Long> ids) {
        noticeService.deleteAll(ids);
        return ResponseEntity.noContent().build();
    }
}