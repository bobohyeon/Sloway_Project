package com.sloway.app.payment.pay.service;

import com.sloway.app.payment.pay.entity.PayEntity;
import com.sloway.app.payment.pay.repository.PayRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

// PG 승인 실패 기록 전용 — 메인 트랜잭션이 롤백돼도 FAILED 상태는 남겨야 하므로 REQUIRES_NEW로 분리
// (PayService 안에서 직접 REQUIRES_NEW를 호출하면 self-invocation이라 프록시가 안 먹어 별도 빈으로 분리)
@Component
@RequiredArgsConstructor
@Slf4j
public class PayFailureRecorder {

    private final PayRepository payRepository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void markFailed(Long payNo) {
        payRepository.findById(payNo).ifPresent(PayEntity::failPay);
        log.warn("결제 FAILED 기록 payNo={}", payNo);
    }
}
