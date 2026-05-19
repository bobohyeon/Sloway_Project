package com.sloway.app.payment.pay.repository;

import com.sloway.app.payment.pay.entity.PayEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PayRepository extends JpaRepository<PayEntity, Long>, PayRepositoryCustom {
}
