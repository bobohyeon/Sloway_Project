package com.sloway.app.payment.coupon.service;

import com.sloway.app.payment.coupon.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// TODO: 쿠폰 서비스
//       메서드 컨벤션: createCoupon / findCouponAll / findCouponById / useCoupon
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class CouponService {

    private final CouponRepository couponRepository;

    // TODO: createCoupon(...) — 쿠폰 발급

    // TODO: findCouponAll() / findCouponById(Long id)

    // TODO: useCoupon(Long couponNo, Long payNo)
    //       - Pay 결제 시 호출되어 쿠폰 사용 처리
    //       - 학습 로그 결정 (옵션 A): 본체 로직은 Coupon 도메인 만들 때 채움
}
