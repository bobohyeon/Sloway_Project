package com.sloway.app.payment.stats.repository;

import com.sloway.app.payment.stats.entity.DailyRefundStatsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DailyRefundStatsRepository extends JpaRepository<DailyRefundStatsEntity, Long>, DailyRefundStatsRepositoryCustom {
}
