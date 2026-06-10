package com.sloway.app.payment.settlement.settle.repository;


import com.querydsl.core.Tuple;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.payment.settlement.settle.common.SettleStatus;
import com.sloway.app.payment.settlement.settle.dto.response.SettleResDto;
import com.sloway.app.payment.settlement.settle.dto.response.SettleStatsResDto;
import com.sloway.app.payment.settlement.settle.entity.QSettleEntity;
import com.sloway.app.payment.settlement.settle.entity.SettleEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class SettleRepositoryImpl implements SettleRepositoryCustom {

    private final JPAQueryFactory jpaQueryFactory;
    private static final QSettleEntity qSettleEntity = QSettleEntity.settleEntity;


    @Override
    public Optional<SettleEntity> findLatestByHostNo(Long hostNo) {
        return Optional.ofNullable(
                jpaQueryFactory
                        .selectFrom(qSettleEntity)
                        .where(
                                qSettleEntity.hostNo.no.eq(hostNo)
                        )
                        .orderBy(qSettleEntity.no.desc())
                        .fetchFirst()
        );
    }

    @Override
    public List<SettleEntity> findByHostNo(Long hostNo) {
        return jpaQueryFactory
                .selectFrom(qSettleEntity)
                .where(
                        qSettleEntity.hostNo.no.eq(hostNo)
                )
                .orderBy(qSettleEntity.no.desc())
                .fetch();
    }

    @Override
    public List<SettleEntity> findByStatus(SettleStatus status) {
        return jpaQueryFactory
                .selectFrom(qSettleEntity)
                .where(qSettleEntity.status.eq(status))
                .fetch();
    }


    @Override
    public Page<SettleResDto> findSettleAll(PageRequest pageRequest, SettleStatus status) {
        List<SettleEntity> settleEntityList = jpaQueryFactory
                .selectFrom(qSettleEntity)
                .where(statusEq(status))
                .orderBy(qSettleEntity.no.desc())
                .offset(pageRequest.getOffset())
                .limit(pageRequest.getPageSize())
                .fetch();
        Long total = jpaQueryFactory
                .select(qSettleEntity.count())
                .from(qSettleEntity)
                .where(statusEq(status))
                .fetchOne();
        List<SettleResDto> list = settleEntityList.stream().map(SettleResDto::from).toList();
        return new PageImpl<>(list,pageRequest,total);
    }

    @Override
    public SettleStatsResDto findSettleStats() {
        NumberExpression<Long> payoutSum = qSettleEntity.payoutAmt.sum().longValue().coalesce(0L);

        List<Tuple> rows = jpaQueryFactory
                .select(qSettleEntity.status, qSettleEntity.count(), payoutSum)
                .from(qSettleEntity)
                .groupBy(qSettleEntity.status)
                .fetch();

        long waiting = 0, complete = 0, invoice = 0, totalPayout = 0;
        for (Tuple row : rows) {
            SettleStatus status = row.get(qSettleEntity.status);
            long cnt = row.get(qSettleEntity.count());
            long amt = row.get(payoutSum);
            totalPayout += amt;
            if (status == SettleStatus.WAITING) waiting = cnt;
            else if (status == SettleStatus.COMPLETE) complete = cnt;
            else if (status == SettleStatus.INVOICE) invoice = cnt;
        }

        return SettleStatsResDto.builder()
                .waiting(waiting)
                .complete(complete)
                .invoice(invoice)
                .totalPayout(totalPayout)
                .build();
    }

    private BooleanExpression statusEq(SettleStatus status) {
        return status == null ? null : qSettleEntity.status.eq(status);
    }

}
