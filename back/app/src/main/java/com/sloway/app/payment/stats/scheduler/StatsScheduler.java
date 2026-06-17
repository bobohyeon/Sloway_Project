package com.sloway.app.payment.stats.scheduler;

import com.sloway.app.payment.stats.service.StatsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@Slf4j
public class StatsScheduler {

    private final StatsService statsService;

    // 30분마다 집계 — 당일 결제도 30분 내 통계 반영 (lag 24h → 30m).
    // loadDailyStats 는 멱등(upsert)이라 같은 날 반복 적재해도 안전.
    // 오늘 + 어제 둘 다 돌려 자정 경계(23:30~00:00 결제 누락) 보정.
    @Scheduled(cron = "0 0/30 * * * *")
    public void loadDailyStats() {
        statsService.loadDailyStats(LocalDate.now());
        statsService.loadDailyStats(LocalDate.now().minusDays(1));
    }

}
