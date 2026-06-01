package com.sloway.app.payment.settlement.account.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.payment.settlement.account.entity.AccountEntity;
import com.sloway.app.payment.settlement.account.entity.QAccountEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class AccountRepositoryImpl implements AccountRepositoryCustom {

    private final JPAQueryFactory jpaQueryFactory;
    private static QAccountEntity qAccountEntity = QAccountEntity.accountEntity;

    @Override
    public AccountEntity findByHostNo(Long hostNo) {
        return
                jpaQueryFactory
                        .selectFrom(qAccountEntity)
                        .where(
                                qAccountEntity.hostNo.no.eq(hostNo)
                        )
                        .fetchOne();
    }
}

