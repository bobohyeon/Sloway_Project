package com.sloway.app.payment.stats.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.member.common.MemberStatus;
import com.sloway.app.member.entity.QMemberEntity;
import com.sloway.app.place.entity.hostPlace.ApprovalStatus;
import com.sloway.app.place.entity.hostPlace.QHostPlaceEntity;
import com.sloway.app.reservation.rsvn.entity.QRsvnEntity;
import com.sloway.app.reservation.rsvn.entity.RsvnStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
@RequiredArgsConstructor
public class StatsRepositoryImpl implements StatsRepositoryCustom {

    private final JPAQueryFactory jpaQueryFactory;
    private static final QHostPlaceEntity qHostPlaceEntity = QHostPlaceEntity.hostPlaceEntity;
    private static final QRsvnEntity qRsvnEntity = QRsvnEntity.rsvnEntity;
    private static final QMemberEntity qMemberEntity = QMemberEntity.memberEntity;

    @Override
    public Long countHostPlace() {
        return jpaQueryFactory
                .select(qHostPlaceEntity.count())
                .from(qHostPlaceEntity)
                .fetchOne();
    }


    @Override
    public Long countHostPlaceByOffice() {
        return jpaQueryFactory
                .select(qHostPlaceEntity.count())
                .from(qHostPlaceEntity)
                .where(
                        qHostPlaceEntity.officeEntity.isNotNull()
                )
                .fetchOne();
    }

    @Override
    public Long countHostPlaceByStation() {
        return jpaQueryFactory
                .select(qHostPlaceEntity.count())
                .from(qHostPlaceEntity)
                .where(
                        qHostPlaceEntity.stationEntity.isNotNull()
                )
                .fetchOne();
    }

    @Override
    public Long countHostPlaceByWorkStay() {
        return jpaQueryFactory
                .select(qHostPlaceEntity.count())
                .from(qHostPlaceEntity)
                .where(
                        qHostPlaceEntity.workStayEntity.isNotNull()
                )
                .fetchOne();
    }

    @Override
    public Long countHostPlaceByStatus(ApprovalStatus status) {
        return jpaQueryFactory
                .select(qHostPlaceEntity.count())
                .from(qHostPlaceEntity)
                .where(
                        qHostPlaceEntity.status.eq(status)
                )
                .fetchOne();
    }

    @Override
    public Long countHostPlaceByCreatedAtBetween(LocalDateTime start, LocalDateTime end) {
        return jpaQueryFactory
                .select(qHostPlaceEntity.count())
                .from(qHostPlaceEntity)
                .where(
                        qHostPlaceEntity.createdAt.between(start, end)
                )
                .fetchOne();
    }

    @Override
    public Long countRsvnByCreatedAtBetween(LocalDateTime start, LocalDateTime end) {
        return jpaQueryFactory
                .select(qRsvnEntity.count())
                .from(qRsvnEntity)
                .where(
                        qRsvnEntity.createdAt.between(start, end)
                )
                .fetchOne();
    }

    @Override
    public Long countRsvnByStatusAndCreatedAtBetween(RsvnStatus status, LocalDateTime start, LocalDateTime end) {
        return jpaQueryFactory
                .select(qRsvnEntity.count())
                .from(qRsvnEntity)
                .where(
                        qRsvnEntity.status.eq(status),
                        qRsvnEntity.createdAt.between(start, end)
                )
                .fetchOne();
    }

    @Override
    public Long countMember() {
        return jpaQueryFactory
                .select(qMemberEntity.count())
                .from(qMemberEntity)
                .fetchOne();
    }

    @Override
    public Long countMemberByStatus(MemberStatus status) {
        return jpaQueryFactory
                .select(qMemberEntity.count())
                .from(qMemberEntity)
                .where(
                        qMemberEntity.status.eq(status)
                )
                .fetchOne();
    }

    @Override
    public Long countMemberByCreatedAtBetween(LocalDateTime start, LocalDateTime end) {
        return jpaQueryFactory
                .select(qMemberEntity.count())
                .from(qMemberEntity)
                .where(
                        qMemberEntity.createdAt.between(start, end)
                )
                .fetchOne();
    }
}
