package com.sloway.app.search.placeDetail.controller;

import com.sloway.app.search.placeDetail.dto.PlaceDetailResDto;
import com.sloway.app.search.placeDetail.service.PlaceDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RequiredArgsConstructor
@RequestMapping("/api/spaces")
@RestController
public class PlaceDetailController {

    private final PlaceDetailService placeDetailService;

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
}
