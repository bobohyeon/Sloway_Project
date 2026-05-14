package com.sloway.app.payment.settlement.settle.repository;

import com.sloway.app.payment.settlement.settle.entity.SettleEntity;
import org.springframework.data.jpa.repository.JpaRepository;

// TODO: 정산 리포지토리
//       - 추후 JPQL 메서드 추가 예정
//       - 예: 호스트별 정산 내역, 특정 기간 정산 내역 조회
public interface SettleRepository extends JpaRepository<SettleEntity, Long> {

    // TODO: 추후 JPQL 메서드 추가
}
