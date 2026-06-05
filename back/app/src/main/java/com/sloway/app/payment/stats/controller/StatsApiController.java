package com.sloway.app.payment.stats.controller;

import com.sloway.app.auth.user.CustomUserDetails;
import com.sloway.app.payment.stats.dto.response.*;
import com.sloway.app.payment.stats.service.StatsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    public ResponseEntity<MonthlySalesResDto> findStatsMonthlySales(@RequestParam int year, @RequestParam int month, @RequestParam(defaultValue = "1") int months) {
        MonthlySalesResDto resDto = statsService.findStatsMonthlySales(year, month, months);
        return ResponseEntity.ok(resDto);
    }

    @GetMapping("/methods")
    public ResponseEntity<List<PayMethodStatResDto>> findStatsPayMethods(@RequestParam int year, @RequestParam int month, @RequestParam(defaultValue = "1") int months) {
        List<PayMethodStatResDto> resDtoList = statsService.findStatsPayMethods(year, month, months);
        return ResponseEntity.ok(resDtoList);
    }

    @GetMapping("/trend")
    public ResponseEntity<List<MonthlyTrendResDto>> findStatsMonthlyTrend(@RequestParam int year, @RequestParam int month, @RequestParam(defaultValue = "1") int months) {
        List<MonthlyTrendResDto> resDtoList = statsService.findStatsMonthlyTrend(year, month, months);
        return ResponseEntity.ok(resDtoList);
    }


    @GetMapping("/refund")
    public ResponseEntity<RefundStatResDto> findStatsRefund(@RequestParam int year, @RequestParam int month, @RequestParam(defaultValue = "1") int months) {
        RefundStatResDto resDto = statsService.findStatsRefund(year, month, months);
        return ResponseEntity.ok(resDto);
    }

    @GetMapping("/host")
    public ResponseEntity<HostSalesStatsResDto> findHostSalesStats(@AuthenticationPrincipal CustomUserDetails host, @RequestParam int year, @RequestParam int month, @RequestParam(defaultValue = "1") int months) {
        HostSalesStatsResDto resDto = statsService.findHostSalesStats(host.getMemberNo(), year, month, months);
        return ResponseEntity.ok(resDto);
    }

    // 어드민 — 특정 호스트 매출 통계 조회 (SecurityConfig 에서 ADMIN 권한 필요)
    @GetMapping("/admin/host/{hostNo}")
    public ResponseEntity<HostSalesStatsResDto> findHostSalesStatsForAdmin(@PathVariable Long hostNo, @RequestParam int year, @RequestParam int month, @RequestParam(defaultValue = "1") int months) {
        HostSalesStatsResDto resDto = statsService.findHostSalesStatsForAdmin(hostNo, year, month, months);
        return ResponseEntity.ok(resDto);
    }

    @GetMapping("/space")
    public ResponseEntity<SpaceStatsResDto> findSpaceStat(@RequestParam int year, @RequestParam int month, @RequestParam(defaultValue = "1") int months) {
        SpaceStatsResDto resDto = statsService.findSpaceStats(year, month, months);
        return ResponseEntity.ok(resDto);
    }

    @GetMapping("/booking")
    public ResponseEntity<BookingStatsResDto> findBookingStats(@RequestParam int year, @RequestParam int month, @RequestParam(defaultValue = "1") int months) {
        BookingStatsResDto resDto = statsService.findBookingStats(year, month, months);
        return ResponseEntity.ok(resDto);
    }

    @GetMapping("/member")
    public ResponseEntity<MemberStatsResDto> findMemberStats(@RequestParam int year, @RequestParam int month, @RequestParam(defaultValue = "1") int months) {
        MemberStatsResDto resDto = statsService.findMemberStats(year, month, months);
        return ResponseEntity.ok(resDto);
    }


}
