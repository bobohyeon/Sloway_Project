package com.sloway.app.payment.couponevent.repository;

public interface CouponEventRepositoryCustom {

    boolean existsByEventAndMember(Long eventNo, Long memberNo);

}
