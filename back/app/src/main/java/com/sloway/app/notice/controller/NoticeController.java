package com.sloway.app.notice.controller;

import com.sloway.app.notice.dto.request.NoticeWriteReqDto;
import com.sloway.app.notice.service.NoticeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/notice")
@RequiredArgsConstructor
@Slf4j
public class NoticeController {

    private final NoticeService noticeService;

    @PostMapping
    public ResponseEntity<Object> write(@RequestBody NoticeWriteReqDto reqDto){
        noticeService.write(reqDto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .build();
    }
}
