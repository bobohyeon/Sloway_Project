package com.sloway.app.payment.couponevent.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.payment.coupon.entity.QCouponEntity;
import com.sloway.app.payment.couponevent.entity.CouponEventEntity;
import com.sloway.app.payment.couponevent.entity.QCouponEventEntity;
import jakarta.persistence.LockModeType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class CouponEventRepositoryImpl implements CouponEventRepositoryCustom {

    private final JPAQueryFactory jpaQueryFactory;
    private static final QCouponEntity qCouponEntity = QCouponEntity.couponEntity;
    private static final QCouponEventEntity qCouponEventEntity = QCouponEventEntity.couponEventEntity;

    @Override
    public boolean existsByEventAndMember(Long eventNo, Long memberNo) {
        return jpaQueryFactory
                .selectFrom(qCouponEntity)
                .where(
                        qCouponEntity.couponEventNo.no.eq(eventNo),
                        qCouponEntity.memberNo.no.eq(memberNo)
                )
                .fetchFirst() != null;
    }

    @Override
    public Optional<CouponEventEntity> findByIdForUpdate(Long no) {
        return Optional.ofNullable(
                jpaQueryFactory
                        .selectFrom(qCouponEventEntity)
                        .where(qCouponEventEntity.no.eq(no))
                        .setLockMode(LockModeType.PESSIMISTIC_WRITE)
                        .fetchOne()
        );
    }
}
