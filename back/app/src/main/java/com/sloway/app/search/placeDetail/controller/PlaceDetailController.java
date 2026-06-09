package com.sloway.app.search.placeDetail.controller;

import com.sloway.app.reservation.blackOut.dto.response.BlackOutResDto;
import com.sloway.app.reservation.blackOut.service.BlackOutService;
import com.sloway.app.search.placeDetail.dto.PlaceDetailResDto;
import com.sloway.app.search.placeDetail.service.PlaceDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RequestMapping("/api/spaces")
@RestController
public class PlaceDetailController {

    private final PlaceDetailService placeDetailService;
    private final BlackOutService blackOutService;

    @GetMapping("/find/{entityNo}")
    public ResponseEntity<PlaceDetailResDto> findByEntityNo(@PathVariable Long entityNo){
        return ResponseEntity.ok(placeDetailService.findByEntityNo(entityNo));
    }

    @GetMapping("/office/{no}")
    public ResponseEntity<PlaceDetailResDto> getOfficeDetail(@PathVariable Long no){
        PlaceDetailResDto dtoList = placeDetailService.getOfficeDetail(no);
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/station/{no}")
    public ResponseEntity<PlaceDetailResDto> getStationDetail(@PathVariable Long no){
        PlaceDetailResDto dtoList = placeDetailService.getStationDetail(no);
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/workStay/{no}")
    public ResponseEntity<PlaceDetailResDto> getWorkStayDetail(@PathVariable Long no){
        PlaceDetailResDto dtoList = placeDetailService.getWorkStayDetail(no);
        return ResponseEntity.ok(dtoList);
    }

    // 사용자 예약 화면에서 이용불가 날짜 조회 (공개 — 인증 불필요)
    @GetMapping("/{entityNo}/blackout")
    public ResponseEntity<List<BlackOutResDto>> findBlackouts(@PathVariable Long entityNo) {
        return ResponseEntity.ok(blackOutService.findAll(entityNo));
    }
}
