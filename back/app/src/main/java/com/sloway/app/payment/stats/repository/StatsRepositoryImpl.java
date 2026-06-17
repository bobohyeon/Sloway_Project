package com.sloway.app.payment.stats.repository;

import com.querydsl.core.Tuple;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.StringExpression;
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
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

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
                .where(qHostPlaceEntity.placeEntity.isNotNull())
                .fetchOne();
    }


    // 타입 row 판별 (office/station/work 중 하나라도 not null = PLACE-only row 제외)
    private BooleanExpression typedRow() {
        return qHostPlaceEntity.officeEntity.isNotNull()
                .or(qHostPlaceEntity.stationEntity.isNotNull())
                .or(qHostPlaceEntity.workStayEntity.isNotNull());
    }

    // 공간 식별 키 — 타입별 id에 접두('O'/'S'/'W')를 붙여 타입 간 번호 충돌 방지.
    // 재제출 등으로 같은 공간 row가 여러 개여도 countDistinct 하면 1개로 셈.
    private StringExpression spaceKey() {
        return new CaseBuilder()
                .when(qHostPlaceEntity.officeEntity.isNotNull())
                .then(qHostPlaceEntity.officeEntity.no.stringValue().prepend("O"))
                .when(qHostPlaceEntity.stationEntity.isNotNull())
                .then(qHostPlaceEntity.stationEntity.no.stringValue().prepend("S"))
                .when(qHostPlaceEntity.workStayEntity.isNotNull())
                .then(qHostPlaceEntity.workStayEntity.no.stringValue().prepend("W"))
                .otherwise(Expressions.nullExpression(String.class));
    }

    @Override
    public Long countHostPlaceByOffice() {
        // count(*) → countDistinct: 재제출 중복 row 제거하고 실제 공간 수만 셈
        return jpaQueryFactory
                .select(qHostPlaceEntity.officeEntity.no.countDistinct())
                .from(qHostPlaceEntity)
                .where(
                        qHostPlaceEntity.officeEntity.isNotNull()
                )
                .fetchOne();
    }

    @Override
    public Long countHostPlaceByStation() {
        return jpaQueryFactory
                .select(qHostPlaceEntity.stationEntity.no.countDistinct())
                .from(qHostPlaceEntity)
                .where(
                        qHostPlaceEntity.stationEntity.isNotNull()
                )
                .fetchOne();
    }

    @Override
    public Long countHostPlaceByWorkStay() {
        return jpaQueryFactory
                .select(qHostPlaceEntity.workStayEntity.no.countDistinct())
                .from(qHostPlaceEntity)
                .where(
                        qHostPlaceEntity.workStayEntity.isNotNull()
                )
                .fetchOne();
    }

    @Override
    public Long countHostPlaceByStatus(ApprovalStatus status) {
        // 상태별 distinct 공간 수 (중복 row 제거)
        return jpaQueryFactory
                .select(spaceKey().countDistinct())
                .from(qHostPlaceEntity)
                .where(
                        qHostPlaceEntity.status.eq(status),
                        typedRow()
                )
                .fetchOne();
    }

    @Override
    public Long countHostPlaceByCreatedAtBetween(LocalDateTime start, LocalDateTime end) {
        return jpaQueryFactory
                .select(spaceKey().countDistinct())
                .from(qHostPlaceEntity)
                .where(
                        qHostPlaceEntity.createdAt.between(start, end),
                        typedRow()
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

    // 예약 상태별 건수를 GROUP BY 한 쿼리로 집계 — 상태마다 count를 따로 날리지 않고 1회 조회로 묶음
    @Override
    public Map<RsvnStatus, Long> countRsvnGroupByStatus(LocalDateTime start, LocalDateTime end) {
        List<Tuple> rows = jpaQueryFactory
                .select(qRsvnEntity.status, qRsvnEntity.count())
                .from(qRsvnEntity)
                .where(qRsvnEntity.createdAt.between(start, end))
                .groupBy(qRsvnEntity.status)
                .fetch();
        Map<RsvnStatus, Long> result = new EnumMap<>(RsvnStatus.class);
        for (Tuple row : rows) {
            result.put(row.get(qRsvnEntity.status), row.get(qRsvnEntity.count()));
        }
        return result;
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
