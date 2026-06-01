package com.sloway.app.payment.settlement.settle.repository;


import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sloway.app.payment.settlement.settle.entity.QSettleEntity;
import com.sloway.app.payment.settlement.settle.entity.SettleEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class SettleRepositoryImpl implements SettleRepositoryCustom {

    private final JPAQueryFactory jpaQueryFactory;
    private static final QSettleEntity qSettleEntity = QSettleEntity.settleEntity;


    @Override
    public Optional<SettleEntity> findLatestByHostNo(Long hostNo) {
        return Optional.ofNullable(
                jpaQueryFactory
                        .selectFrom(qSettleEntity)
                        .where(
                                qSettleEntity.hostNo.no.eq(hostNo)
                        )
                        .orderBy(qSettleEntity.no.desc())
                        .fetchFirst()
        );
    }

    // TODO: findByHostNo 본체 — 위 findLatestByHostNo 를 복사한 뒤 3곳만 변경
    //   ① 반환 타입 List<SettleEntity> (Optional.ofNullable 감싸기 제거)
    //   ② fetchFirst() → fetch() (여러 건)
    //   ③ where(hostNo) + orderBy(no.desc()) 는 그대로 (최근순)
}
