package com.sloway.app.payment.stats.repository;

import com.sloway.app.payment.stats.entity.DailyPayStatsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DailyPayStatsRepository extends JpaRepository<DailyPayStatsEntity, Long>, DailyPayStatsRepositoryCustom {
}
