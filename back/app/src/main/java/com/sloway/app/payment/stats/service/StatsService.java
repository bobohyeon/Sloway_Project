package com.sloway.app.payment.stats.service;

import com.querydsl.core.Tuple;
import com.sloway.app.payment.pay.common.PayMethod;
import com.sloway.app.payment.pay.repository.PayRepository;
import com.sloway.app.payment.refund.repository.RefundRepository;
import com.sloway.app.payment.stats.entity.DailyPayStatsEntity;
import com.sloway.app.payment.stats.entity.DailyRefundStatsEntity;
import com.sloway.app.payment.stats.repository.DailyPayStatsRepository;
import com.sloway.app.payment.stats.repository.DailyRefundStatsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class StatsService {

    private final PayRepository payRepository;
    private final RefundRepository refundRepository;
    private final DailyPayStatsRepository dailyPayStatsRepository;
    private final DailyRefundStatsRepository dailyRefundStatsRepository;

    @Transactional
    public void loadDailyStats(LocalDate targetDate) {
        LocalDateTime startTime = targetDate.atStartOfDay();
        LocalDateTime endTime = targetDate.atTime(23, 59, 59);
        List<Tuple> list = payRepository.sumByMethodBetween(startTime, endTime);

        for (Tuple tuple : list) {
            PayMethod payMethod = tuple.get(0, PayMethod.class);
            Long count = tuple.get(1, Long.class);
            Integer sum = tuple.get(2, Integer.class);
            dailyPayStatsRepository
                    .findByStatDateAndPayMethod(targetDate,
                            payMethod)
                    .ifPresentOrElse(
                            entity ->
                                    entity.updateStats(count.intValue(), sum),
                            () -> dailyPayStatsRepository.save(
                                    DailyPayStatsEntity.builder()
                                            .statDate(targetDate)
                                            .payMethod(payMethod)
                                            .payCount(count.intValue())
                                            .totalAmt(sum)
                                            .build()
                            )
                    );
        }

        Tuple refundTuple = refundRepository.sumBetween(startTime,
                endTime);
        Long refundCount = refundTuple.get(0, Long.class);
        BigDecimal refundAmt = refundTuple.get(1, BigDecimal.class);

        dailyRefundStatsRepository.findByStatDate(targetDate)
                .ifPresentOrElse(
                        entity ->
                                entity.updateStats(refundCount.intValue(), refundAmt),
                        () -> dailyRefundStatsRepository.save(
                                DailyRefundStatsEntity.builder()
                                        .statDate(targetDate)

                                        .refundCount(refundCount.intValue())
                                        .refundAmt(refundAmt)
                                        .build()
                        )
                );
    }

    // ════════ 조회용 (API — 6단계, 나중에) ════════
    // TODO: 통계 4종 조회 — 이제 PayRepository 직접 집계가 아니라
    //       집계 테이블(DailyXxxStats)을 읽어 roll-up (findByStatDateBetween)
    //   1) 월별 매출 요약   → MonthlySalesResDto       (월 범위 행들 합산)
    //   2) 결제수단별 분포  → List<PayMethodStatResDto>  (수단별 묶기)
    //   3) 월별 시계열 추이 → List<MonthlyTrendResDto>
    //   4) 환불 통계        → RefundStatResDto
    //   조회 메서드명 컨벤션: 도메인명 접두 (findStatsXxx)
}
