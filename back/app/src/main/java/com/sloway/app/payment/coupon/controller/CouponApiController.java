package com.sloway.app.payment.coupon.controller;

import com.sloway.app.payment.coupon.dto.request.CouponCreateReqDto;
import com.sloway.app.payment.coupon.dto.response.CouponResDto;
import com.sloway.app.payment.coupon.service.CouponService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment/coupon")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin
public class CouponApiController {

    private final CouponService couponService;

    @PostMapping
    public ResponseEntity<CouponResDto> createCoupon(@RequestBody CouponCreateReqDto reqDto) {
        CouponResDto resDto = couponService.createCoupon(reqDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(resDto);
    }

    @GetMapping
    public ResponseEntity<List<CouponResDto>> findCouponAll() {
        List<CouponResDto> couponList = couponService.findCouponAll();
        return ResponseEntity.ok(couponList);
    }

    @GetMapping("/{no}")
    public ResponseEntity<CouponResDto> findCouponByNo(@PathVariable Long no) {
        CouponResDto couponResDto = couponService.findCouponByNo(no);
        return ResponseEntity.ok(couponResDto);
    }
}
