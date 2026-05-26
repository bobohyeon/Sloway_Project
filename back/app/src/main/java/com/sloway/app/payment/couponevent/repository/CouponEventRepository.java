package com.sloway.app.payment.couponevent.repository;

import com.sloway.app.payment.couponevent.entity.CouponEventEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CouponEventRepository  extends JpaRepository<CouponEventEntity , Long> , CouponEventRepositoryCustom {
}
