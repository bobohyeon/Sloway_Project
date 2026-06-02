package com.sloway.app.payment.stats.controller;

import com.sloway.app.payment.stats.dto.response.*;
import com.sloway.app.payment.stats.service.StatsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment/stats")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin
public class StatsApiController {

    private final StatsService statsService;

    @GetMapping("/summary")
    public ResponseEntity<MonthlySalesResDto> findStatsMonthlySales(@RequestParam int year, @RequestParam int month) {
        MonthlySalesResDto resDto = statsService.findStatsMonthlySales(year, month);
        return ResponseEntity.ok(resDto);
    }

    @GetMapping("/methods")
    public ResponseEntity<List<PayMethodStatResDto>> findStatsPayMethods(@RequestParam int year, @RequestParam int month) {
        List<PayMethodStatResDto> resDtoList = statsService.findStatsPayMethods(year, month);
        return ResponseEntity.ok(resDtoList);
    }

    @GetMapping("/trend")
    public ResponseEntity<List<MonthlyTrendResDto>> findStatsMonthlyTrend(@RequestParam int year, @RequestParam int month) {
        List<MonthlyTrendResDto> resDtoList = statsService.findStatsMonthlyTrend(year, month);
        return ResponseEntity.ok(resDtoList);
    }


    @GetMapping("/refund")
    public ResponseEntity<RefundStatResDto> findStatsRefund(@RequestParam int year, @RequestParam int month) {
        RefundStatResDto resDto = statsService.findStatsRefund(year, month);
        return ResponseEntity.ok(resDto);
    }

    @GetMapping("/host/{hostNo}")
    public ResponseEntity<HostSalesStatsResDto> findHostSalesStats(@PathVariable Long hostNo, @RequestParam int year, @RequestParam int month) {
        HostSalesStatsResDto resDto = statsService.findHostSalesStats(hostNo, year, month);
        return ResponseEntity.ok(resDto);
    }

    @GetMapping("/space")
    public void findSpaceStat(@RequestParam int year,@RequestParam int month) {
    }

    @GetMapping("/booking")
    public void findBookingStats(@RequestParam int year,@RequestParam int month) {
    }

    @GetMapping("/member")
    public void findMemberStats(@RequestParam int year,@RequestParam int month) {
    }

}
