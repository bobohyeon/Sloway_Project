package com.sloway.app.payment.refund.repository;

import com.querydsl.core.Tuple;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.payment.refund.common.RefundRate;
import com.sloway.app.payment.refund.common.RefundStatus;
import com.sloway.app.payment.refund.dto.response.RefundResDto;
import com.sloway.app.payment.refund.dto.response.RefundStatsResDto;
import com.sloway.app.payment.refund.entity.QRefundEntity;
import com.sloway.app.payment.refund.entity.RefundEntity;
import com.sloway.app.reservation.rsvn.entity.QRsvnEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
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
                .orderBy(qRefundEntity.no.desc())
                .fetch();
    }

    @Override
    public Page<RefundResDto> findRefundAll(PageRequest pageRequest, String tab, LocalDateTime from) {
        QRsvnEntity qRsvn = new QRsvnEntity("rsvn");
        List<RefundEntity> list = jpaQueryFactory
                .selectFrom(qRefundEntity)
                .leftJoin(qRefundEntity.rsvnNo, qRsvn).fetchJoin()
                .leftJoin(qRsvn.memberNo).fetchJoin()
                .leftJoin(qRsvn.officeNo).fetchJoin()
                .leftJoin(qRsvn.stationNo).fetchJoin()
                .leftJoin(qRsvn.workStayNo).fetchJoin()
                .where(tabFilter(tab), createdAfter(from))
                .orderBy(qRefundEntity.no.desc())
                .offset(pageRequest.getOffset())
                .limit(pageRequest.getPageSize())
                .fetch();

        Long total = jpaQueryFactory
                .select(qRefundEntity.count())
                .from(qRefundEntity)
                .where(tabFilter(tab), createdAfter(from))
                .fetchOne();

        List<RefundResDto> content = list.stream().map(RefundResDto::from).toList();
        return new PageImpl<>(content, pageRequest, total == null ? 0 : total);
    }

    @Override
    public RefundStatsResDto findRefundStats() {
        return RefundStatsResDto.builder()
                .total(countWhere(null))
                .processing(countWhere(qRefundEntity.status.in(RefundStatus.REQUESTED, RefundStatus.APPROVED)))
                .completed(countWhere(qRefundEntity.status.eq(RefundStatus.COMPLETED)))
                .hostRejected(countWhere(hostRejectedCond()))
                .build();
    }

    private long countWhere(BooleanExpression cond) {
        Long c = jpaQueryFactory.select(qRefundEntity.count()).from(qRefundEntity).where(cond).fetchOne();
        return c == null ? 0 : c;
    }

    // 탭 → where 조건. all/null=전체, completed=COMPLETED, host_rejected=호스트 거절
    private BooleanExpression tabFilter(String tab) {
        if (tab == null || tab.equals("all")) return null;
        if (tab.equals("completed")) return qRefundEntity.status.eq(RefundStatus.COMPLETED);
        if (tab.equals("host_rejected")) return hostRejectedCond();
        return null;
    }

    // 호스트 거절 식별 — refundReason null + refundRate FULL 조합 (프론트 isHostRejectedRefund 와 동일)
    private BooleanExpression hostRejectedCond() {
        return qRefundEntity.refundReason.isNull().and(qRefundEntity.refundRate.eq(RefundRate.FULL));
    }

    private BooleanExpression createdAfter(LocalDateTime from) {
        return from == null ? null : qRefundEntity.createdAt.goe(from);
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
