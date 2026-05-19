package com.sloway.app.payment.point.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.payment.point.common.PointStatus;
import com.sloway.app.payment.point.entity.QPointEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

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

}
