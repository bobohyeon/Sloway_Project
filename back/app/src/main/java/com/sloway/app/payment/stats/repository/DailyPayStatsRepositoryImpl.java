package com.sloway.app.payment.stats.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.payment.pay.common.PayMethod;
import com.sloway.app.payment.stats.entity.DailyPayStatsEntity;
import com.sloway.app.payment.stats.entity.QDailyPayStatsEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class DailyPayStatsRepositoryImpl implements DailyPayStatsRepositoryCustom {

    private final JPAQueryFactory jpaQueryFactory;
    private static final QDailyPayStatsEntity qDailyPayStatsEntity = QDailyPayStatsEntity.dailyPayStatsEntity;

    @Override
    public Optional<DailyPayStatsEntity> findByStatDateAndPayMethod(LocalDate statDate, PayMethod payMethod) {
        return Optional.ofNullable(jpaQueryFactory
                .selectFrom(qDailyPayStatsEntity)
                .where(
                        qDailyPayStatsEntity.statDate.eq(statDate),
                        qDailyPayStatsEntity.payMethod.eq(payMethod)
                )
                .fetchOne());
    }

    @Override
    public List<DailyPayStatsEntity> findByStatDateBetween(LocalDate statDate, LocalDate endDate) {
        return jpaQueryFactory
                .selectFrom(qDailyPayStatsEntity)
                .where(
                        qDailyPayStatsEntity.statDate.between(statDate, endDate)
                )
                .fetch();
    }

}
