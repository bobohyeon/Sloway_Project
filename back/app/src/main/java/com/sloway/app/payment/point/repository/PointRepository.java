package com.sloway.app.payment.point.repository;

import com.sloway.app.payment.point.entity.PointEntity;
import org.springframework.data.jpa.repository.JpaRepository;

// TODO: 포인트 리포지토리
//       - 추후 JPQL 메서드 추가 예정
//         예: 회원별 현재 잔액 집계, 사용가능 적립 내역(확정 + 미만료) 조회
public interface PointRepository extends JpaRepository<PointEntity, Long> {

    // TODO: 추후 JPQL 메서드 추가
}
