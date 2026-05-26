package com.sloway.app.payment.stats.controller;

import com.sloway.app.payment.stats.service.StatsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

// TODO: 통계 컨트롤러 — 월 단위 파라미터
//       URL 베이스: /api/payment/stats
//
// ─── 월 식별 파라미터 설계 (택1) ───
//   · @RequestParam int year, @RequestParam int month
//   · @RequestParam String yearMonth ("2026-05") → YearMonth.parse 로 분해
//   시계열 추이는 연도만 받을 수도: ?year=2026
//
// ─── 엔드포인트 구성 (DTO 구조 A/B 결정에 따름) ───
//   · 통합형(A) → GET 하나로 대시보드 반환
//   · 분리형(B) → GET /summary, /methods, /trend, /refund 식으로 나눔
//
//   참고: PayApiController / RefundApiController 핸들러 패턴 (@GetMapping + ResponseEntity.ok)
@RestController
@RequestMapping("/api/payment/stats")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin
public class StatsApiController {

    private final StatsService statsService;

    // TODO: 분리형 B — 4 엔드포인트 (각 핸들러가 자기 DTO 반환)
    //   GET /summary?year&month → MonthlySalesResDto
    //   GET /methods?year&month → List<PayMethodStatResDto>
    //   GET /trend?year         → List<MonthlyTrendResDto>
    //   GET /refund?year&month  → RefundStatResDto
}
