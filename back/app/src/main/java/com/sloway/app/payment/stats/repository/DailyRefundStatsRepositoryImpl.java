package com.sloway.app.payment.stats.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.payment.stats.entity.DailyRefundStatsEntity;
import com.sloway.app.payment.stats.entity.QDailyRefundStatsEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class DailyRefundStatsRepositoryImpl implements DailyRefundStatsRepositoryCustom {

    private final JPAQueryFactory jpaQueryFactory;
    private static final QDailyRefundStatsEntity qDailyRefundStatsEntity = QDailyRefundStatsEntity.dailyRefundStatsEntity;

    @Override
    public Optional<DailyRefundStatsEntity> findByStatDate(LocalDate statDate) {
        return Optional.ofNullable(jpaQueryFactory
                .selectFrom(qDailyRefundStatsEntity)
                .where(
                        qDailyRefundStatsEntity.statDate.eq(statDate)
                )
                .fetchOne());
    }

    @Override
    public List<DailyRefundStatsEntity> findByStatDateBetween(LocalDate statDate, LocalDate endDate) {
        return jpaQueryFactory
                .selectFrom(qDailyRefundStatsEntity)
                .where(
                        qDailyRefundStatsEntity.statDate.between(statDate, endDate)
                )
                .fetch();
    }

}
