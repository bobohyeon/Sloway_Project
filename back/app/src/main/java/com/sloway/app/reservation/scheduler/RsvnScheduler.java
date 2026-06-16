package com.sloway.app.reservation.scheduler;

import com.sloway.app.reservation.rsvn.service.RsvnService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@RequiredArgsConstructor
@Component
public class RsvnScheduler {

    private final RsvnService rsvnService;

    @Scheduled(cron = "0 0 * * * *") //매 정각
    public void completeRsvns(){
        rsvnService.completeRsvns();
    }

    @Scheduled(cron = "0 0 * * * *")
    public void cancelExpiredPending(){
        rsvnService.cancelExpiredPending();
    }
}
