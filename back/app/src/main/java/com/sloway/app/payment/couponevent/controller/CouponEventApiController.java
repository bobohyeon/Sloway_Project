package com.sloway.app.payment.couponevent.controller;

import com.sloway.app.auth.user.CustomUserDetails;
import com.sloway.app.payment.coupon.dto.response.CouponResDto;
import com.sloway.app.payment.couponevent.dto.request.CouponEventCreateReqDto;
import com.sloway.app.payment.couponevent.dto.response.CouponEventResDto;
import com.sloway.app.payment.couponevent.service.CouponEventService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment/coupon/event")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin
public class CouponEventApiController {

    private final CouponEventService couponEventService;

    @PostMapping
    public ResponseEntity<CouponEventResDto> createEvent(@RequestBody CouponEventCreateReqDto reqDto) {
        CouponEventResDto eventResDto = couponEventService.createEvent(reqDto);

        return ResponseEntity.status(HttpStatus.CREATED).body(eventResDto);

    }

    @GetMapping
    public ResponseEntity<List<CouponEventResDto>> findEventAll() {
        List<CouponEventResDto> eventResDtoList = couponEventService.findEventAll();
        return ResponseEntity.ok(eventResDtoList);
    }

    @PatchMapping("/{no}/close")
    public ResponseEntity<CouponEventResDto> closeEvent(@PathVariable Long no) {
        CouponEventResDto couponEventResDto = couponEventService.closeEvent(no);
        return ResponseEntity.ok(couponEventResDto);
    }

    @PostMapping("/{no}/download")
    public ResponseEntity<CouponResDto> downloadCoupon(
            @PathVariable Long no,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        // 발급 대상 = 로그인 본인. body의 memberNo를 신뢰하면 타인 명의로 발급 가능하므로 principal 사용
        CouponResDto couponResDto = couponEventService.downloadCoupon(no, userDetails.getMemberNo());
        return ResponseEntity.status(HttpStatus.CREATED).body(couponResDto);
    }


}
