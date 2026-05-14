package com.sloway.app.payment.settlement.fee.repository;

import com.sloway.app.payment.settlement.fee.entity.FeeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeeRepository extends JpaRepository<FeeEntity, Long> {
}
