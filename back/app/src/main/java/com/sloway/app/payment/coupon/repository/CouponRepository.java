package com.sloway.app.payment.coupon.repository;

import com.sloway.app.payment.coupon.entity.CouponEntity;
import org.springframework.data.jpa.repository.JpaRepository;

// TODO: 쿠폰 리포지토리
//       - 추후 JPQL 메서드 추가 (회원별 보유 쿠폰, 사용가능 쿠폰 등)
public interface CouponRepository extends JpaRepository<CouponEntity, Long> {

    // TODO: 추후 JPQL 메서드 추가
}
