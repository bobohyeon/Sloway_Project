package com.sloway.app.payment.stats.repository;

import com.sloway.app.payment.pay.common.PayMethod;
import com.sloway.app.payment.pay.dto.response.MonthlySumDto;
import com.sloway.app.payment.stats.entity.DailyPayStatsEntity;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DailyPayStatsRepositoryCustom {

    Optional<DailyPayStatsEntity> findByStatDateAndPayMethod(LocalDate statDate, PayMethod payMethod);
    List<DailyPayStatsEntity> findByStatDateBetween(LocalDate statDate,LocalDate endDate);

    // 월별 매출 합계를 GROUP BY 한 쿼리로 (호출부 월별 루프 6쿼리 → 1쿼리)
    List<MonthlySumDto> sumByMonthBetween(LocalDate start, LocalDate end);
}
