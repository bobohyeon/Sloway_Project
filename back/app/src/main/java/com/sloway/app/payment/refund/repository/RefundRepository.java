package com.sloway.app.payment.refund.repository;

import com.sloway.app.payment.refund.entity.RefundEntity;
import org.springframework.data.jpa.repository.JpaRepository;

// TODO: 환불 리포지토리
//       - 일단 JpaRepository 기본 메서드만 (findAll, findById, save)
//       - 추후 JPQL 메서드 추가 예정 (본인이 JPQL로 변경하기로 결정)
public interface RefundRepository extends JpaRepository<RefundEntity, Long> {

    // TODO: 추후 JPQL 메서드 추가
    //       예시:
    //       @Query("SELECT r FROM RefundEntity r WHERE r.payNo = :payNo")
    //       List<RefundEntity> findRefundByPayNo(@Param("payNo") Long payNo);
}
