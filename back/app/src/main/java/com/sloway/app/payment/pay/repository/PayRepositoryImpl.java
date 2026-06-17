package com.sloway.app.payment.pay.repository;

import com.querydsl.core.Tuple;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.payment.pay.common.PayStatus;
import com.sloway.app.payment.pay.dto.response.MonthlySumDto;
import com.sloway.app.payment.pay.dto.response.PayResDto;
import com.sloway.app.payment.pay.dto.response.PayStatsResDto;
import com.sloway.app.payment.pay.entity.PayEntity;
import com.sloway.app.payment.pay.entity.QPayEntity;
import com.sloway.app.reservation.rsvn.entity.QRsvnEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class PayRepositoryImpl implements PayRepositoryCustom {

    private final JPAQueryFactory jpaQueryFactory;
    private static final QPayEntity qPayEntity = QPayEntity.payEntity;


    @Override
    public List<PayEntity> findByMember(Long memberNo) {
        List<PayEntity> payEntityList = jpaQueryFactory
                .selectFrom(qPayEntity)
                .where(
                        qPayEntity.rsvnNo.memberNo.no.eq(memberNo)
                )
                .fetch();
        return payEntityList;
    }

    @Override
    public List<PayEntity> findByRsvn(Long rsvnNo) {
        List<PayEntity> payEntityList = jpaQueryFactory
                .selectFrom(qPayEntity)
                .where(
                        qPayEntity.rsvnNo.no.eq(rsvnNo)
                )
                .fetch();
        return payEntityList;
    }

    @Override
    public List<PayEntity> findByRsvnNoIn(List<Long> rsvnNos) {
        return jpaQueryFactory
                .selectFrom(qPayEntity)
                .where(
                        qPayEntity.rsvnNo.no.in(rsvnNos)
                )
                .fetch();
    }

    @Override
    public List<Tuple> sumByMethodBetween(LocalDateTime startDateTime, LocalDateTime endDateTime) {
        return jpaQueryFactory
                .select(
                        qPayEntity.method,
                        qPayEntity.count(),
                        qPayEntity.finalAmt.sum().longValue()
                )
                .from(qPayEntity)
                .where(
                        // 총매출(gross) = 한 번이라도 결제 성공한 건. 환불(CANCELED)도 포함해야
                        // "총매출 - 환불 = 순매출"이 성립. (READY/FAILED 만 제외)
                        qPayEntity.status.in(PayStatus.COMPLETED, PayStatus.CANCELED),
                        qPayEntity.createdAt.between(startDateTime, endDateTime)
                )
                .groupBy(qPayEntity.method)
                .fetch();
    }

    @Override
    public Long sumByOfficeIn(List<Long> officeNos, LocalDateTime start, LocalDateTime end) {
        return jpaQueryFactory
                .select(qPayEntity.finalAmt.sum().longValue().coalesce(0L))
                .from(qPayEntity)
                .where(
                        qPayEntity.rsvnNo.officeNo.no.in(officeNos),
                        qPayEntity.status.eq(PayStatus.COMPLETED),
                        qPayEntity.createdAt.between(start, end)
                )
                .fetchOne();
    }

    @Override
    public Long sumByStationIn(List<Long> stationNos, LocalDateTime start, LocalDateTime end) {
        return jpaQueryFactory
                .select(qPayEntity.finalAmt.sum().longValue().coalesce(0L))
                .from(qPayEntity)
                .where(
                        qPayEntity.rsvnNo.stationNo.no.in(stationNos),
                        qPayEntity.status.eq(PayStatus.COMPLETED),
                        qPayEntity.createdAt.between(start, end)
                )
                .fetchOne();
    }

    @Override
    public Long sumByWorkStayIn(List<Long> workStayNos, LocalDateTime start, LocalDateTime end) {
        return jpaQueryFactory
                .select(qPayEntity.finalAmt.sum().longValue().coalesce(0L))
                .from(qPayEntity)
                .where(
                        qPayEntity.rsvnNo.workStayNo.no.in(workStayNos),
                        qPayEntity.status.eq(PayStatus.COMPLETED),
                        qPayEntity.createdAt.between(start, end)
                )
                .fetchOne();
    }

    @Override
    public List<MonthlySumDto> sumByMonthBetween(List<Long> officeNos, List<Long> stationNos, List<Long> workStayNos, LocalDateTime start, LocalDateTime end) {
        var month = com.querydsl.core.types.dsl.Expressions
                .stringTemplate("to_char({0}, 'YYYY-MM')", qPayEntity.createdAt);
        NumberExpression<Long> sum  = qPayEntity.finalAmt.sum().longValue();
        return jpaQueryFactory
                .select(Projections.constructor(MonthlySumDto.class,month,sum))
                .from(qPayEntity)
                .where(
                        qPayEntity.status.eq(PayStatus.COMPLETED),
                        qPayEntity.createdAt.between(start, end),
                        qPayEntity.rsvnNo.officeNo.no.in(officeNos)
                                .or(qPayEntity.rsvnNo.stationNo.no.in(stationNos))
                                .or(qPayEntity.rsvnNo.workStayNo.no.in(workStayNos))
                )
                .groupBy(month)
                .fetch();
    }

    @Override
    public Long sumSalesStatsByOfficeIn(List<Long> officeNos, LocalDateTime start, LocalDateTime end) {
        return jpaQueryFactory
                .select(qPayEntity.count())
                .from(qPayEntity)
                .where(
                        qPayEntity.rsvnNo.officeNo.no.in(officeNos),
                        qPayEntity.status.eq(PayStatus.COMPLETED),
                        qPayEntity.createdAt.between(start, end)
                )
                .fetchOne();
    }

    @Override
    public Long sumSalesStatsByStationIn(List<Long> stationNos, LocalDateTime start, LocalDateTime end) {
        return jpaQueryFactory
                .select(qPayEntity.count())
                .from(qPayEntity)
                .where(
                        qPayEntity.rsvnNo.stationNo.no.in(stationNos),
                        qPayEntity.status.eq(PayStatus.COMPLETED),
                        qPayEntity.createdAt.between(start, end)
                )
                .fetchOne();
    }

    @Override
    public Long sumSalesStatsByWorkStayIn(List<Long> workStayNos, LocalDateTime start, LocalDateTime end) {
        return jpaQueryFactory
                .select(qPayEntity.count())
                .from(qPayEntity)
                .where(
                        qPayEntity.rsvnNo.workStayNo.no.in(workStayNos),
                        qPayEntity.status.eq(PayStatus.COMPLETED),
                        qPayEntity.createdAt.between(start, end)
                )
                .fetchOne();
    }

    // 어드민 결제 목록
    @Override
    public Page<PayResDto> findPayAll(PageRequest pageRequest, PayStatus status, LocalDateTime from) {
        QRsvnEntity qRsvn = new QRsvnEntity("rsvn");
        List<PayEntity> payEntityList = jpaQueryFactory
                .selectFrom(qPayEntity)
                .leftJoin(qPayEntity.rsvnNo, qRsvn).fetchJoin()   // 예약
                .leftJoin(qRsvn.memberNo).fetchJoin()             // → 회원 이름
                .leftJoin(qRsvn.officeNo).fetchJoin()             // → 공간명 (셋 중 채워진 하나)
                .leftJoin(qRsvn.stationNo).fetchJoin()
                .leftJoin(qRsvn.workStayNo).fetchJoin()
                .where(statusEq(status), createdAfter(from), qPayEntity.status.ne(PayStatus.READY))
                .orderBy(qPayEntity.no.desc())
                .offset(pageRequest.getOffset())
                .limit(pageRequest.getPageSize())
                .fetch();

        Long total = jpaQueryFactory
                .select(qPayEntity.count())
                .from(qPayEntity)
                .where(statusEq(status), createdAfter(from), qPayEntity.status.ne(PayStatus.READY))
                .fetchOne();

        List<PayResDto> list = payEntityList.stream().map(PayResDto::from).toList();

        return new PageImpl<>(list, pageRequest, total == null ? 0 : total);
    }

    @Override
    public PayStatsResDto findPayStats(LocalDateTime from) {
        NumberExpression<Long> amtSum = qPayEntity.finalAmt.sum().longValue().coalesce(0L);

        List<Tuple> rows = jpaQueryFactory
                .select(
                        qPayEntity.status,
                        qPayEntity.count(),
                        amtSum
                )
                .from(qPayEntity)
                // 결제 도중 이탈(READY)은 통계 집계에서 제외 — 어드민은 완료/취소만 집계
                .where(createdAfter(from), qPayEntity.status.ne(PayStatus.READY))
                .groupBy(qPayEntity.status)
                .fetch();

        long total = 0, completed = 0, completedAmt = 0, refunded = 0, failed = 0;
        for (Tuple row : rows) {
            PayStatus status = row.get(qPayEntity.status);
            long cnt = row.get(qPayEntity.count());
            long amt = row.get(amtSum);
            total += cnt;
            if (status == PayStatus.COMPLETED) {
                completed = cnt;
                completedAmt = amt;
            } else if (status == PayStatus.CANCELED) {
                refunded = cnt;
            } else if (status == PayStatus.FAILED) {
                failed = cnt;
            }
        }

        return PayStatsResDto.builder()
                .total(total)
                .completed(completed)
                .completedAmt(completedAmt)
                .refunded(refunded)
                .failed(failed)
                .build();
    }

    private BooleanExpression statusEq(PayStatus status) {
        return status == null ? null : qPayEntity.status.eq(status);
    }

    private BooleanExpression createdAfter(LocalDateTime from) {
        return from == null ? null : qPayEntity.createdAt.goe(from);
    }



}
