package com.sloway.app.payment.stats.service;

import com.querydsl.core.Tuple;
import com.sloway.app.payment.pay.common.PayMethod;
import com.sloway.app.payment.pay.repository.PayRepository;
import com.sloway.app.payment.refund.repository.RefundRepository;
import com.sloway.app.payment.stats.dto.response.MonthlySalesResDto;
import com.sloway.app.payment.stats.dto.response.MonthlyTrendResDto;
import com.sloway.app.payment.stats.dto.response.PayMethodStatResDto;
import com.sloway.app.payment.stats.dto.response.RefundStatResDto;
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
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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

    public MonthlySalesResDto findStatsMonthlySales(int year, int month) {
        YearMonth ym = YearMonth.of(year, month);
        LocalDate start = YearMonth.of(year, month).atDay(1);
        LocalDate end = YearMonth.of(year, month).atEndOfMonth();

        List<DailyPayStatsEntity> payRows = dailyPayStatsRepository.findByStatDateBetween(start, end);
        int totalAmt = payRows.stream().mapToInt(DailyPayStatsEntity::getTotalAmt).sum();
        long payCount = payRows.stream().mapToInt(DailyPayStatsEntity::getPayCount).sum();

        int refundAmt = dailyRefundStatsRepository.findByStatDateBetween(start, end).stream()
                .map(DailyRefundStatsEntity::getRefundAmt)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .intValue();

        return MonthlySalesResDto.of(ym.toString(), totalAmt, payCount, refundAmt);
    }


    public List<PayMethodStatResDto> findStatsPayMethods(int year, int month) {
        YearMonth ym = YearMonth.of(year, month);
        LocalDate start = YearMonth.of(year, month).atDay(1);
        LocalDate end = YearMonth.of(year, month).atEndOfMonth();

        List<DailyPayStatsEntity> payRows = dailyPayStatsRepository.findByStatDateBetween(start, end);
        return payRows.stream()
                .collect(Collectors.groupingBy(DailyPayStatsEntity::getPayMethod))
                .entrySet().stream()
                .map(entry -> {
                    PayMethod method = entry.getKey();
                    List<DailyPayStatsEntity> rows = entry.getValue();
                    int count = rows.stream().mapToInt(DailyPayStatsEntity::getPayCount).sum();
                    int amt = rows.stream().mapToInt(DailyPayStatsEntity::getTotalAmt).sum();
                    return PayMethodStatResDto.of(method, count, amt);
                })
                .toList();
    }


    public List<MonthlyTrendResDto> findStatsMonthlyTrend(int year, int month) {
        YearMonth base = YearMonth.of(year, month);
        List<MonthlyTrendResDto> result = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            YearMonth ym = base.minusMonths(i);
            LocalDate start = ym.atDay(1);
            LocalDate end = ym.atEndOfMonth();
            int totalAmt = dailyPayStatsRepository.findByStatDateBetween(start, end).stream()
                    .mapToInt(DailyPayStatsEntity::getTotalAmt)
                    .sum();
            result.add(MonthlyTrendResDto.of(ym.toString(), totalAmt));
        }
        return result;
    }


    public RefundStatResDto findStatsRefund(int year, int month) {
        YearMonth ym = YearMonth.of(year, month);
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();
        List<DailyRefundStatsEntity> refundRows = dailyRefundStatsRepository.findByStatDateBetween(start, end);
        int refundCount = refundRows.stream().mapToInt(DailyRefundStatsEntity::getRefundCount).sum();
        BigDecimal refundAmt = refundRows.stream()
                .map(DailyRefundStatsEntity::getRefundAmt)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        int finalAmt = dailyPayStatsRepository.findByStatDateBetween(start, end).stream()
                .mapToInt(DailyPayStatsEntity::getTotalAmt)
                .sum();
        return RefundStatResDto.of(refundCount, refundAmt, finalAmt);
    }

}
