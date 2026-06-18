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

    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Seoul")
    public void confirmEarnPoints(){
        pointService.confirmEarnPointsScheduled();
    }

    // 매일 00:30 — 유효기간 지난 보유 포인트 만료 처리(잔액에서 자동 제외)
    @Scheduled(cron = "0 30 0 * * *", zone = "Asia/Seoul")
    public void expirePoints(){
        pointService.expirePointsScheduled();
    }
}
