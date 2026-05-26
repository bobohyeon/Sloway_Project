package com.sloway.app.payment.stats.repository;

import com.sloway.app.payment.stats.entity.DailyRefundStatsEntity;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DailyRefundStatsRepositoryCustom {

    Optional<DailyRefundStatsEntity> findByStatDate(LocalDate statDate);

    List<DailyRefundStatsEntity> findByStatDateBetween(LocalDate statDate, LocalDate endDate);

}
