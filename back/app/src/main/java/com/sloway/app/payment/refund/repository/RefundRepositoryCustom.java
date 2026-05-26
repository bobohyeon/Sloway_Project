package com.sloway.app.payment.refund.repository;

import com.querydsl.core.Tuple;
import com.sloway.app.payment.refund.common.RefundStatus;
import com.sloway.app.payment.refund.entity.RefundEntity;

import java.time.LocalDateTime;
import java.util.List;

public interface RefundRepositoryCustom {

    boolean existsByPayAndStatus(Long payNo, List<RefundStatus> refundStatuses);

    List<RefundEntity> findByMember(Long memberNo);

    Tuple sumBetween(LocalDateTime startDateTime, LocalDateTime endDateTime);
}
