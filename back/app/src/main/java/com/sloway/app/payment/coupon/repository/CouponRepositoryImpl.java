package com.sloway.app.payment.coupon.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.payment.coupon.common.CouponStatus;
import com.sloway.app.payment.coupon.entity.CouponEntity;
import com.sloway.app.payment.coupon.entity.QCouponEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class CouponRepositoryImpl implements CouponRepositoryCustom {

    private final JPAQueryFactory jpaQueryFactory;
    private static final QCouponEntity qCouponEntity = QCouponEntity.couponEntity;

    @Override
    public List<CouponEntity> findByMemberAndStatus(Long memberNo, CouponStatus status) {
        List<CouponEntity> couponList = jpaQueryFactory
                .selectFrom(qCouponEntity)
                .where(
                        qCouponEntity.memberNo.no.eq(memberNo),
                        qCouponEntity.status.eq(status)
                )
                .fetch();
        return couponList;
    }

    @Override
    public List<CouponEntity> findByCouponEventAndStatus(Long couponEventNo, CouponStatus status) {
        return jpaQueryFactory
                .selectFrom(qCouponEntity)
                .where(
                        qCouponEntity.couponEventNo.no.eq(couponEventNo),
                        qCouponEntity.status.eq(status)
                )
                .fetch();
    }

}
