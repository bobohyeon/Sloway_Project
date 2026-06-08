package com.sloway.app.payment.coupon.repository;

import com.sloway.app.payment.coupon.entity.CouponEntity;
import com.sloway.app.payment.coupon.common.CouponStatus;

import java.util.List;

public interface CouponRepositoryCustom {

     List<CouponEntity> findByMemberAndStatus(Long memberNo, CouponStatus status);

     List<CouponEntity> findByCouponEventAndStatus(Long couponEventNo, CouponStatus status);
}
