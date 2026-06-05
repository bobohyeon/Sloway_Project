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
    public Map<RsvnStatus, Long> countRsvnGroupByStatus(LocalDateTime start, LocalDateTime end) {
        // status별 count 를 한 번의 group by 로 — DB 왕복 4번 → 1번
        List<Tuple> rows = jpaQueryFactory
                .select(qRsvnEntity.status, qRsvnEntity.count())
                .from(qRsvnEntity)
                .where(qRsvnEntity.createdAt.between(start, end))
                .groupBy(qRsvnEntity.status)
                .fetch();

        // EnumMap — 키가 enum 이라 가볍고 빠름. 결과에 없는 상태는 Service 에서 기본값 0 처리
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
