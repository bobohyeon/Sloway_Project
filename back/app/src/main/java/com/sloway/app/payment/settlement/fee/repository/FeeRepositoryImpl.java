package com.sloway.app.payment.settlement.fee.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.payment.settlement.fee.common.PlaceType;
import com.sloway.app.payment.settlement.fee.entity.FeeEntity;
import com.sloway.app.payment.settlement.fee.entity.QFeeEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class FeeRepositoryImpl implements FeeRepositoryCustom {

    private final JPAQueryFactory jpaQueryFactory;
    private static final QFeeEntity qFeeEntity = QFeeEntity.feeEntity;


    @Override
    public Optional<FeeEntity> findValidFee(PlaceType placeType, LocalDateTime date) {
        return Optional.ofNullable(jpaQueryFactory
                .selectFrom(qFeeEntity)
                .where(
                        qFeeEntity.placeType.eq(placeType),
                        qFeeEntity.delYn.eq("N"),
                        qFeeEntity.startAt.isNull().or(qFeeEntity.startAt.loe(date)),
                        qFeeEntity.endAt.isNull().or(qFeeEntity.endAt.goe(date))
                )
                .fetchOne());

    }

}
