package com.sloway.app.payment.refund.repository;

import com.sloway.app.payment.refund.common.RefundStatus;

import java.util.List;

public interface RefundRepositoryCustom {

    boolean existsByPayAndStatus(Long payNo, List<RefundStatus> refundStatuses);
}
