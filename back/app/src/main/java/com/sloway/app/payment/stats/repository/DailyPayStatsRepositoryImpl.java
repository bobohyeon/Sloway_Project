package com.sloway.app.payment.stats.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.payment.pay.common.PayMethod;
import com.sloway.app.payment.pay.dto.response.MonthlySumDto;
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

    @Override
    public List<MonthlySumDto> sumByMonthBetween(LocalDate start, LocalDate end) {
        // stat_date(LocalDate)를 'YYYY-MM'로 잘라 그 단위로 GROUP BY → 월별 합계를 한 방에
        // (PayRepository.sumByMonthBetween의 to_char GROUP BY 패턴을 사전집계 테이블에 그대로 이식)
        var month = Expressions.stringTemplate("to_char({0}, 'YYYY-MM')", qDailyPayStatsEntity.statDate);
        NumberExpression<Long> sum = qDailyPayStatsEntity.totalAmt.sum();
        return jpaQueryFactory
                .select(Projections.constructor(MonthlySumDto.class, month, sum))
                .from(qDailyPayStatsEntity)
                .where(qDailyPayStatsEntity.statDate.between(start, end))
                .groupBy(month)
                .fetch();
    }

}
