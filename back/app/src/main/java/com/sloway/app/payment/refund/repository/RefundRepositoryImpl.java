package com.sloway.app.payment.refund.repository;

import com.querydsl.core.Tuple;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.payment.refund.common.RefundStatus;
import com.sloway.app.payment.refund.entity.QRefundEntity;
import com.sloway.app.payment.refund.entity.RefundEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
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

    @Override
    public List<RefundEntity> findByMember(Long memberNo) {
        return jpaQueryFactory
                .selectFrom(qRefundEntity)
                .where(
                        qRefundEntity.rsvnNo.memberNo.no.eq(memberNo)
                )
                .fetch();
    }

    @Override
    public Tuple sumBetween(LocalDateTime startDateTime, LocalDateTime endDateTime) {
        return jpaQueryFactory
                .select(
                        qRefundEntity.count(),
                        qRefundEntity.refundAmt.sum().coalesce(BigDecimal.ZERO)
                )
                .from(qRefundEntity)
                .where(
                        qRefundEntity.status.eq(RefundStatus.COMPLETED),
                        qRefundEntity.createdAt.between(startDateTime, endDateTime)
                )
                .fetchOne();
    }
    @Override
    public BigDecimal sumByOfficeIn(List<Long> officeNos, LocalDateTime start, LocalDateTime end) {
        return jpaQueryFactory
                .select(qRefundEntity.refundAmt.sum().coalesce(BigDecimal.ZERO))
                .from(qRefundEntity)
                .where(
                        qRefundEntity.rsvnNo.officeNo.no.in(officeNos),
                        qRefundEntity.status.eq(RefundStatus.COMPLETED),
                        qRefundEntity.createdAt.between(start, end)
                )
                .fetchOne();
    }
    @Override
    public BigDecimal sumByStationIn(List<Long> stationNos, LocalDateTime start, LocalDateTime end) {
        return jpaQueryFactory
                .select(qRefundEntity.refundAmt.sum().coalesce(BigDecimal.ZERO))
                .from(qRefundEntity)
                .where(
                        qRefundEntity.rsvnNo.stationNo.no.in(stationNos),
                        qRefundEntity.status.eq(RefundStatus.COMPLETED),
                        qRefundEntity.createdAt.between(start, end)
                )
                .fetchOne();
    }
    @Override
    public BigDecimal sumByWorkStayIn(List<Long> workStayNos, LocalDateTime start, LocalDateTime end) {
        return jpaQueryFactory
                .select(qRefundEntity.refundAmt.sum().coalesce(BigDecimal.ZERO))
                .from(qRefundEntity)
                .where(
                        qRefundEntity.rsvnNo.workStayNo.no.in(workStayNos),
                        qRefundEntity.status.eq(RefundStatus.COMPLETED),
                        qRefundEntity.createdAt.between(start, end)
                )
                .fetchOne();
    }
}
