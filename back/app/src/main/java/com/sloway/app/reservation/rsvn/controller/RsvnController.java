package com.sloway.app.reservation.rsvn.controller;

import com.sloway.app.reservation.rsvn.dto.request.RsvnReqDto;
import com.sloway.app.reservation.rsvn.dto.response.RsvnResDto;
import com.sloway.app.reservation.rsvn.service.RsvnService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/reservation")
@RequiredArgsConstructor
@RestController
public class RsvnController {

    private final RsvnService rsvnService;

    //예약하기
    @PostMapping
    public ResponseEntity<Void> save(@RequestBody RsvnReqDto dto, @RequestParam Long memberNo){
        rsvnService.save(memberNo, dto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .build();
    }

    //내 예약 목록 조회
    @GetMapping
    public ResponseEntity<List<RsvnResDto>> findAll(@RequestParam Long memberNo){
        List<RsvnResDto> dtoList = rsvnService.findAll(memberNo);
        return ResponseEntity.ok(dtoList);
    }

    //내 예약 정보 상세 조회
    @GetMapping("/{no}")
    public ResponseEntity<RsvnResDto> findOne(@RequestParam Long memberNo, @PathVariable Long no){
        RsvnResDto dto = rsvnService.findOne(memberNo,no);
        return ResponseEntity.ok(dto);
    }

    //예약 취소
    @PostMapping("/{no}/cancel")
    public ResponseEntity<Void> delete(@RequestParam Long memberNo, @PathVariable Long no){
        rsvnService.cancel(memberNo, no);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
