package com.sloway.app.payment.point.controller;

import com.sloway.app.payment.point.dto.request.PointSaveReqDto;
import com.sloway.app.payment.point.dto.request.PointUseReqDto;
import com.sloway.app.payment.point.dto.response.PointBalanceResDto;
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
    public ResponseEntity<PointResDto> savePoint(@RequestBody PointSaveReqDto pointSaveReqDto) {
        PointResDto pointResDto = pointService.savePoint(pointSaveReqDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(pointResDto);
    }

    @PostMapping("/use")
    public ResponseEntity<PointResDto> usePoint(@RequestBody PointUseReqDto pointSaveReqDto) {
        PointResDto pointResDto = pointService.usePoint(pointSaveReqDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(pointResDto);
    }

    @PatchMapping("/{no}/expire")
    public ResponseEntity<PointResDto> expirePoint(@PathVariable Long no) {
        PointResDto resDto = pointService.expirePoint(no);
        return ResponseEntity.ok(resDto);
    }

    @PatchMapping("/{no}/confirm")
    public ResponseEntity<PointResDto> confirmEarnPoint(@PathVariable Long no) {
        PointResDto resDto = pointService.confirmEarnPoint(no);
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

    @GetMapping("/member/{no}/balance")
    public ResponseEntity<PointBalanceResDto> findPointBalanceByMemberNo(@PathVariable Long no) {
        PointBalanceResDto balance = pointService.findPointBalanceByMemberNo(no);
        return ResponseEntity.ok(balance);
    }

    // ── ④ 포인트 내역 기능 ─────────────────────────────
    // TODO: 회원 번호로 포인트 전체 내역을 돌려주는 GET 핸들러 추가
    //  - 참고: CouponApiController.findCouponsByMemberNo 그대로 (List 반환 + ResponseEntity.ok)
    //  - ⚠️ 경로 주의: 위에 "/member/{no}/balance" 가 이미 있음 → 새 핸들러는 "/member/{no}" (balance 없이)
    //  - 최종 URL = GET /api/payment/point/member/{no}
    //  - 본문은 pointService 의 ③ 메서드 호출
}
