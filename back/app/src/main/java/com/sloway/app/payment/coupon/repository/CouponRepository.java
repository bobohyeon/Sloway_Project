package com.sloway.app.payment.coupon.repository;

import com.sloway.app.payment.coupon.entity.CouponEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.lang.ScopedValue;

public interface CouponRepository extends JpaRepository<CouponEntity, Long> {

}
