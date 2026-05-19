package com.sloway.app.payment.coupon.repository;

import org.springframework.stereotype.Repository;

// 학원 BoardRepositoryImpl 패턴 — 빈 골격 (옵션 ㄱ)
// 향후 QueryDSL 메서드 필요해질 때 PointRepositoryImpl 패턴으로 확장:
//   - @RequiredArgsConstructor 추가
//   - private static final QCouponEntity qCouponEntity = QCouponEntity.couponEntity;
//   - private final JPAQueryFactory jpaQueryFactory;
@Repository
public class CouponRepositoryImpl implements CouponRepositoryCustom {
}
