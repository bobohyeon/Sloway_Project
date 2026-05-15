package com.sloway.app.payment.point.controller;

import com.sloway.app.payment.point.dto.request.PointCreateReqDto;
import com.sloway.app.payment.point.dto.response.PointResDto;
import com.sloway.app.payment.point.service.PointService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment/point")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin
public class PointApiController {

    private final PointService pointService;

    // TODO: POST /api/payment/point — createPoint 핸들러
    @PostMapping
    public ResponseEntity<PointResDto> createPoint(@RequestBody PointCreateReqDto reqDto){
        PointResDto pointResDto = pointService.createPoint(reqDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(pointResDto);
    }


    // TODO: GET /api/payment/point — findPointAll 핸들러

    // TODO: GET /api/payment/point/{no} — findPointById 핸들러
}
