package com.sloway.app.payment.coupon.repository;

import com.sloway.app.payment.coupon.entity.CouponEntity;
import com.sloway.app.payment.coupon.common.CouponStatus;

import java.util.List;

public interface CouponRepositoryCustom {

     List<CouponEntity> findByMemberAndStatus(Long memberNo, CouponStatus status);

     // 쿠폰함 전체 조회 — status 무관(사용가능/사용완료/만료 모두). 프론트가 탭으로 분류
     List<CouponEntity> findByMember(Long memberNo);

     List<CouponEntity> findByCouponEventAndStatus(Long couponEventNo, CouponStatus status);
}
