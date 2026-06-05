package com.sloway.app.payment.pay.repository;

import com.querydsl.core.Tuple;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.payment.pay.common.PayStatus;
import com.sloway.app.payment.pay.dto.response.PayResDto;
import com.sloway.app.payment.pay.dto.response.PayStatsResDto;
import com.sloway.app.payment.pay.entity.PayEntity;
import com.sloway.app.payment.pay.entity.QPayEntity;
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

    // 여러 예약의 결제를 IN 절로 한 번에 — 예약 목록 N+1 제거용
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
                        qPayEntity.status.eq(PayStatus.COMPLETED),
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

    @Override
    public Page<PayResDto> findPayAll(PageRequest pageRequest, PayStatus status, LocalDateTime from) {
        List<PayEntity> payEntityList = jpaQueryFactory
                .selectFrom(qPayEntity)
                .where(statusEq(status), createdAfter(from))
                .orderBy(qPayEntity.no.desc())
                .offset(pageRequest.getOffset())
                .limit(pageRequest.getPageSize())
                .fetch();

        Long total = jpaQueryFactory
                .select(qPayEntity.count())
                .from(qPayEntity)
                .where(statusEq(status), createdAfter(from))
                .fetchOne();

        List<PayResDto> list = payEntityList.stream().map(PayResDto::from).toList();

        return new PageImpl<>(list, pageRequest, total == null ? 0 : total);
    }

    @Override
    public PayStatsResDto findPayStats(LocalDateTime from) {
        // 금액 합계를 long 으로 올림 — 300만건 합계는 int(약 21억)를 넘겨 오버플로우 위험
        // select 와 row.get() 에 같은 expression 객체를 써야 Tuple 매칭이 정확
        NumberExpression<Long> amtSum = qPayEntity.finalAmt.sum().longValue().coalesce(0L);

        List<Tuple> rows = jpaQueryFactory
                .select(
                        qPayEntity.status,
                        qPayEntity.count(),
                        amtSum
                )
                .from(qPayEntity)
                .where(createdAfter(from))
                .groupBy(qPayEntity.status)
                .fetch();

        long total = 0, completed = 0, completedAmt = 0, refunded = 0, failed = 0;
        for (Tuple row : rows) {
            PayStatus status = row.get(qPayEntity.status);
            long cnt = row.get(qPayEntity.count());  // count() 는 Long
            long amt = row.get(amtSum);              // long 합계
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
