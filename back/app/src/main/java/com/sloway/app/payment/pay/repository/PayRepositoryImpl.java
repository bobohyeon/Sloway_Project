package com.sloway.app.payment.pay.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.payment.pay.entity.PayEntity;
import com.sloway.app.payment.pay.entity.QPayEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

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
}
