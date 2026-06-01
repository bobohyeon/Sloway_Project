package com.sloway.app.payment.settlement.settle.repository;

import com.sloway.app.payment.settlement.settle.entity.SettleEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SettleRepository extends JpaRepository<SettleEntity, Long> , SettleRepositoryCustom{

}
