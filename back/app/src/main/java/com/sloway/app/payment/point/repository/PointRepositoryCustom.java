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

    // 유효기간(expiredAt)이 지난 보유 포인트(WAIT/SAVE) — 만료 처리 대상
    List<PointEntity> findExpiredHoldingPoints(LocalDateTime now);

    List<PointEntity> findPointsByMemberNo(Long memberNo);
}
