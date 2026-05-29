package com.sloway.app.payment.point.scheduler;

import com.sloway.app.payment.point.service.PointService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class PointScheduler {
    private final PointService pointService;

    @Scheduled(cron = "0 0 0 * * *")
    public void confirmEarnPoints(){
        pointService.confirmEarnPointsScheduled();
    }
}
