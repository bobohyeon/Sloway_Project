package com.sloway.app.payment.coupon.controller;

import com.sloway.app.payment.coupon.service.CouponService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

// TODO: 쿠폰 컨트롤러
//       URL: /api/payment/coupon
@RestController
@RequestMapping("/api/payment/coupon")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin
public class CouponApiController {

    private final CouponService couponService;

    // TODO: POST /api/payment/coupon — createCoupon 핸들러

    // TODO: GET /api/payment/coupon — findCouponAll 핸들러

    // TODO: GET /api/payment/coupon/{no} — findCouponById 핸들러
}
