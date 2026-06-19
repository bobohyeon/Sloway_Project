package com.sloway.app.payment.refund.repository;

import com.sloway.app.payment.refund.entity.RefundEntity;
import com.sloway.app.reservation.rsvn.entity.RsvnEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RefundRepository extends JpaRepository<RefundEntity, Long> , RefundRepositoryCustom {

    // 예약 목록에 대한 환불 레코드 조회 (환불 여부 판별용)
    List<RefundEntity> findByRsvnNoIn(List<RsvnEntity> rsvnList);
}
