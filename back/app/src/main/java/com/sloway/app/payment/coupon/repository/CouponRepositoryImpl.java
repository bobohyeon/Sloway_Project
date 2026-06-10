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
    public List<CouponEntity> findByMember(Long memberNo) {
        // status 필터 없이 회원의 모든 쿠폰 조회 (최신 발급순) → 사용완료/만료 쿠폰도 쿠폰함에 노출
        return jpaQueryFactory
                .selectFrom(qCouponEntity)
                .where(qCouponEntity.memberNo.no.eq(memberNo))
                .orderBy(qCouponEntity.createdAt.desc())
                .fetch();
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
