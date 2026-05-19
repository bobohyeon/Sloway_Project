package com.sloway.app.payment.point.repository;

// TODO: 학원 BoardRepositoryImpl 참고

// TODO: 클래스 어노테이션 영역
//       - @Repository : 스프링 빈 등록 (필수, 빠지면 부팅 시점 의존성 폭발)
//       - @RequiredArgsConstructor : JPAQueryFactory 생성자 주입

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
