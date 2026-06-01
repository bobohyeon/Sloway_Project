package com.sloway.app.payment.settlement.settle.repository;


import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.payment.settlement.settle.entity.QSettleEntity;
import com.sloway.app.payment.settlement.settle.entity.SettleEntity;
import lombok.RequiredArgsConstructor;
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

}
