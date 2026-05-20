package com.sloway.app.payment.point.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.payment.point.common.PointDealType;
import com.sloway.app.payment.point.common.PointStatus;
import com.sloway.app.payment.point.entity.PointEntity;
import com.sloway.app.payment.point.entity.QPointEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

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


}
