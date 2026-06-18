package com.sloway.app.payment.couponevent.repository;

import com.sloway.app.payment.couponevent.entity.CouponEventEntity;

import java.util.Optional;

public interface CouponEventRepositoryCustom {

    boolean existsByEventAndMember(Long eventNo, Long memberNo);

    // 다운로드 시 이벤트 row 비관적 락 — 동시 다운로드를 직렬화해 재고 초과발급·중복발급 방지
    Optional<CouponEventEntity> findByIdForUpdate(Long no);

}
