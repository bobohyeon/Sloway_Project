package com.sloway.app.payment.refund.repository;

import com.sloway.app.payment.refund.common.RefundStatus;
import com.sloway.app.payment.refund.entity.RefundEntity;

import java.util.List;

public interface RefundRepositoryCustom {

    boolean existsByPayAndStatus(Long payNo, List<RefundStatus> refundStatuses);

    List<RefundEntity> findByMember(Long memberNo);
}
