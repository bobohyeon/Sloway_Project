package com.sloway.app.payment.refund.repository;

import com.querydsl.core.Tuple;
import com.sloway.app.payment.refund.common.RefundStatus;
import com.sloway.app.payment.refund.entity.RefundEntity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface RefundRepositoryCustom {

    boolean existsByPayAndStatus(Long payNo, List<RefundStatus> refundStatuses);

    List<RefundEntity> findByMember(Long memberNo);

    // 어드민 환불 목록 — 예약·회원·공간 fetch join (N+1 제거)
    List<RefundEntity> findAllWithRsvn();

    Tuple sumBetween(LocalDateTime startDateTime, LocalDateTime endDateTime);

    BigDecimal sumByOfficeIn(List<Long> officeNos, LocalDateTime start, LocalDateTime end);

    BigDecimal sumByStationIn(List<Long> stationNos, LocalDateTime start, LocalDateTime end);

    BigDecimal sumByWorkStayIn(List<Long> workStayNos, LocalDateTime start, LocalDateTime end);
}
