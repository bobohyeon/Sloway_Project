package com.sloway.app.payment.stats.repository;

import com.sloway.app.payment.pay.common.PayMethod;
import com.sloway.app.payment.stats.entity.DailyPayStatsEntity;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DailyPayStatsRepositoryCustom {

    Optional<DailyPayStatsEntity> findByStatDateAndPayMethod(LocalDate statDate, PayMethod payMethod);
    List<DailyPayStatsEntity> findByStatDateBetween(LocalDate statDate,LocalDate endDate);
}
