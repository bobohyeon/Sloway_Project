package com.sloway.app.payment.point.repository;

import com.sloway.app.payment.point.common.PointDealType;
import com.sloway.app.payment.point.common.PointStatus;
import com.sloway.app.payment.point.entity.PointEntity;

import java.time.LocalDateTime;
import java.util.List;

public interface PointRepositoryCustom {

    Integer sumByMemberAndStatus(Long memberNo, PointStatus status);

    List<PointEntity> findByPayAndDealType(Long payNo, PointDealType dealType);

    List<PointEntity> findExpiredWaitForEarn(LocalDateTime cutoff);

    // ── ① 포인트 내역 기능 ─────────────────────────────
    // TODO: 회원 번호로 그 회원의 포인트 "전체 내역"을 조회하는 메서드 시그니처 추가
    //  - 무엇을: 적립/사용/만료/취소 가리지 않고 그 회원 것 전부 (상태 필터 X — 내역이니까)
    //  - 참고: CouponRepositoryCustom.findByMemberAndStatus — 단 status 파라미터는 빼고 memberNo 하나만
    //  - 반환 타입은 위 시그니처들과 같은 결(List<PointEntity>)
    //  - 이름은 memberNo만으로 조회한다는 의미가 드러나게 (③ Service가 이 이름을 부름)
}
