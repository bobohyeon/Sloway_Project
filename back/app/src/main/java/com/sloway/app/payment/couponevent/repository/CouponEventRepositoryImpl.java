package com.sloway.app.payment.couponevent.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.payment.coupon.entity.QCouponEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class CouponEventRepositoryImpl implements CouponEventRepositoryCustom {

    private final JPAQueryFactory jpaQueryFactory;
    private static final QCouponEntity qCouponEntity = QCouponEntity.couponEntity;

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
}
