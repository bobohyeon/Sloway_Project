package com.sloway.app.payment.point.controller;

import com.sloway.app.payment.point.service.PointService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

// TODO: 포인트 컨트롤러
//       URL: /api/payment/point
@RestController
@RequestMapping("/api/payment/point")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin
public class PointApiController {

    private final PointService pointService;

    // TODO: POST /api/payment/point — createPoint 핸들러

    // TODO: GET /api/payment/point — findPointAll 핸들러

    // TODO: GET /api/payment/point/{no} — findPointById 핸들러
}
