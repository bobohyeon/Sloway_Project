package com.sloway.app.payment.pay.repository;

import com.querydsl.core.Tuple;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.payment.pay.common.PayStatus;
import com.sloway.app.payment.pay.entity.PayEntity;
import com.sloway.app.payment.pay.entity.QPayEntity;
import lombok.RequiredArgsConstructor;
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
    public List<Tuple> sumByMethodBetween(LocalDateTime startDateTime, LocalDateTime endDateTime) {
        return jpaQueryFactory
                .select(
                        qPayEntity.method,
                        qPayEntity.count(),
                        qPayEntity.finalAmt.sum()
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
    public Integer sumByOfficeIn(List<Long> officeNos, LocalDateTime start, LocalDateTime end) {
        return jpaQueryFactory
                .select(qPayEntity.finalAmt.sum().coalesce(0))
                .from(qPayEntity)
                .where(
                        qPayEntity.rsvnNo.officeNo.no.in(officeNos),
                        qPayEntity.status.eq(PayStatus.COMPLETED),
                        qPayEntity.createdAt.between(start, end)
                )
                .fetchOne();
    }

    @Override
    public Integer sumByStationIn(List<Long> stationNos, LocalDateTime start, LocalDateTime end) {
        return jpaQueryFactory
                .select(qPayEntity.finalAmt.sum().coalesce(0))
                .from(qPayEntity)
                .where(
                        qPayEntity.rsvnNo.stationNo.no.in(stationNos),
                        qPayEntity.status.eq(PayStatus.COMPLETED),
                        qPayEntity.createdAt.between(start, end)
                )
                .fetchOne();
    }

    @Override
    public Integer sumByWorkStayIn(List<Long> workStayNos, LocalDateTime start, LocalDateTime end) {
        return jpaQueryFactory
                .select(qPayEntity.finalAmt.sum().coalesce(0))
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


}
