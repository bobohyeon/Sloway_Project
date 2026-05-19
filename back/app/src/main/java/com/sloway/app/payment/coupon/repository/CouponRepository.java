package com.sloway.app.payment.coupon.repository;

import com.sloway.app.payment.coupon.entity.CouponEntity;
import org.springframework.data.jpa.repository.JpaRepository;


public interface CouponRepository extends JpaRepository<CouponEntity, Long> ,CouponRepositoryCustom {

}
