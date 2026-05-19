package com.sloway.app.payment.refund.repository;

import com.sloway.app.payment.refund.entity.RefundEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RefundRepository extends JpaRepository<RefundEntity, Long> , RefundRepositoryCustom {

}
