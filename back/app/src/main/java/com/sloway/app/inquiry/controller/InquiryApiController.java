package com.sloway.app.inquiry.controller;

import com.sloway.app.inquiry.service.InquiryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/inquiry")
@RequiredArgsConstructor
@Slf4j
public class InquiryApiController {

    private final InquiryService inquiryService;

//    // 관리자 - 답변 등록
//    @PostMapping("/{id}/reply")
//    public void createReply(){
//
//    }
//    // 공통 - 문의 등록
//    @PostMapping
//    public void createInquiry(){
//
//    }
//
//    @GetMapping
//    public void findAll(){}
//
//    @GetMapping
//    public void findById(){}
//
//    @PutMapping
//    public void update(){}
//
//    @DeleteMapping
//    public void delete(){}
}
