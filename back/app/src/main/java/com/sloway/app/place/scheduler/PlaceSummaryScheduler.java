package com.sloway.app.place.scheduler;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PlaceSummaryScheduler {
    private final JdbcTemplate jdbcTemplate;

    @Scheduled(cron = "0 */10 * * * *") // 10분마다 실행
    public void refreshPlaceSummary() {
        jdbcTemplate.execute("REFRESH MATERIALIZED VIEW CONCURRENTLY place_summary");
    }
}