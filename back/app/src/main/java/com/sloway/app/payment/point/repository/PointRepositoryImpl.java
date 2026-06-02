package com.sloway.app.payment.point.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.payment.point.common.PointDealType;
import com.sloway.app.payment.point.common.PointStatus;
import com.sloway.app.payment.point.entity.PointEntity;
import com.sloway.app.payment.point.entity.QPointEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class PointRepositoryImpl implements PointRepositoryCustom {

    private static final QPointEntity qPointEntity = QPointEntity.pointEntity;
    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public Integer sumByMemberAndStatus(Long memberNo, PointStatus status) {
        Integer point = jpaQueryFactory.select(qPointEntity.amount.sum().coalesce(0))
                .from(qPointEntity)
                .where(
                        qPointEntity.memberNo.no.eq(memberNo),
                        qPointEntity.status.eq(status)
                )
                .fetchOne();
        return point;
    }

    @Override
    public List<PointEntity> findByPayAndDealType(Long payNo, PointDealType dealType) {
        List<PointEntity> pointList = jpaQueryFactory.selectFrom(qPointEntity)
                .where(
                        qPointEntity.payNo.no.eq(payNo),
                        qPointEntity.dealType.eq(dealType)
                )
                .fetch();
        return pointList;
    }

    @Override
    public List<PointEntity> findExpiredWaitForEarn(LocalDateTime cutoff) {
        return jpaQueryFactory
                .selectFrom(qPointEntity)
                .where(
                        qPointEntity.status.eq(PointStatus.WAIT),
                        qPointEntity.dealType.eq(PointDealType.EARN),
                        qPointEntity.createdAt.loe(cutoff)
                )
                .fetch();
    }

    // ── ② 포인트 내역 기능 ─────────────────────────────
    // TODO: ①에서 선언한 시그니처를 @Override 로 구현 (QueryDSL)
    //  - 참고: 바로 위 findByPayAndDealType — selectFrom(qPointEntity).where(...).fetch() 패턴 그대로
    //  - where 조건은 회원 번호 일치 하나만 (위 findByPayAndDealType 의 payNo.no 처럼 memberNo.no 활용)
    //  - 💡 결정: 내역은 최신순이 자연스러움 → .orderBy(...) 로 createdAt 내림차순 넣을지 정하기 (QueryDSL desc())

}
