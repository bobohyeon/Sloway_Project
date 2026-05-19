package com.sloway.app.payment.refund.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class RefundRepositoryImpl implements RefundRepositoryCustom {

    private final JPAQueryFactory jpaQueryFactory;

}
