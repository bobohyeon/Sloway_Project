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

    @Scheduled(cron = "0 0 0 * * *")
    public void loadDailyStats() {
        statsService.loadDailyStats(LocalDate.now().minusDays(1));
    }

}
