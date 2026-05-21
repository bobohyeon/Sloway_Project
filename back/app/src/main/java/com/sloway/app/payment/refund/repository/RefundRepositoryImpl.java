package com.sloway.app.payment.refund.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.payment.refund.common.RefundStatus;
import com.sloway.app.payment.refund.entity.QRefundEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class RefundRepositoryImpl implements RefundRepositoryCustom {

    private final JPAQueryFactory jpaQueryFactory;
    private static final QRefundEntity qRefundEntity = QRefundEntity.refundEntity;


    @Override
    public boolean existsByPayAndStatus(Long payNo, List<RefundStatus> refundStatuses) {
        return jpaQueryFactory
                .selectFrom(qRefundEntity)
                .where(
                        qRefundEntity.payNo.no.eq(payNo),
                        qRefundEntity.status.in(refundStatuses)
                )
                .fetchFirst() != null;
    }

}
