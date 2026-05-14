package com.sloway.app.payment.stats.controller;

import com.sloway.app.payment.stats.service.StatsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

// TODO: 통계 컨트롤러
//       URL: /api/payment/stats
//       파라미터: 기간(start, end), 호스트 ID 등 — @RequestParam 활용
@RestController
@RequestMapping("/api/payment/stats")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin
public class StatsApiController {

    private final StatsService statsService;

    // TODO: GET /api/payment/stats — 기간/조건별 통계 조회
    //       @RequestParam 으로 쿼리스트링 받기
}
