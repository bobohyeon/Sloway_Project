package com.sloway.app.payment.stats.repository;

import com.querydsl.core.Tuple;
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
                // TODO(KPI 일관화): 등록공간(total)이 타입합(상세 row)이 됐으니 운영중/대기도 상세 row 기준으로
                //  - 아래 placeEntity.isNotNull()(=place 전용 row) 를 상세 row 기준으로 교체. 두 방법 중 택1:
                //     ① qHostPlaceEntity.placeEntity.isNull()  (place 안 가진 row = 600구조의 상세 row, 간단)
                //     ② officeEntity.isNotNull().or(stationEntity.isNotNull()).or(workStayEntity.isNotNull())  (상세타입 명시)
                .where(
                        qHostPlaceEntity.status.eq(status),
                        qHostPlaceEntity.placeEntity.isNotNull()
                )
                .fetchOne();
    }

    @Override
    public Long countHostPlaceByCreatedAtBetween(LocalDateTime start, LocalDateTime end) {
        return jpaQueryFactory
                .select(qHostPlaceEntity.count())
                .from(qHostPlaceEntity)
                // TODO(KPI 일관화): 신규 등록도 상세 row 기준으로 (위 countHostPlaceByStatus 와 동일 방식)
                //  - placeEntity.isNotNull() → ① placeEntity.isNull() 또는 ② 상세타입 OR isNotNull
                .where(
                        qHostPlaceEntity.createdAt.between(start, end),
                        qHostPlaceEntity.placeEntity.isNotNull()
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
