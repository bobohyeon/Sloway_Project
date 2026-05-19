package com.sloway.app.payment.point.controller;

import com.sloway.app.payment.point.dto.request.PointSaveReqDto;
import com.sloway.app.payment.point.dto.request.PointUseReqDto;
import com.sloway.app.payment.point.dto.response.PointResDto;
import com.sloway.app.payment.point.service.PointService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment/point")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin
public class PointApiController {

    private final PointService pointService;

    @PostMapping("/save")
    public ResponseEntity<PointResDto> savePoint(@RequestBody PointSaveReqDto reqDto) {
        PointResDto pointResDto = pointService.savePoint(reqDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(pointResDto);
    }

    @PostMapping("/use")
    public ResponseEntity<PointResDto> usePoint(@RequestBody PointUseReqDto reqDto) {
        PointResDto pointResDto = pointService.usePoint(reqDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(pointResDto);
    }

    @PatchMapping("/{no}/expire")
    public ResponseEntity<PointResDto> expirePoint(@PathVariable Long no){
        PointResDto resDto = pointService.expirePoint(no);
        return ResponseEntity.ok(resDto);
    }

    @GetMapping
    public ResponseEntity<List<PointResDto>> findPointAll() {
        List<PointResDto> pointList = pointService.findPointAll();
        return ResponseEntity.ok(pointList);
    }

    @GetMapping("/{no}")
    public ResponseEntity<PointResDto> findPointByNo(@PathVariable Long no) {
        PointResDto pointResDto = pointService.findPointByNo(no);
        return ResponseEntity.ok(pointResDto);
    }
}
