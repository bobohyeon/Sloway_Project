package com.sloway.app.payment.pay.repository;

import com.querydsl.core.Tuple;
import com.sloway.app.payment.pay.entity.PayEntity;

import java.time.LocalDateTime;
import java.util.List;

public interface PayRepositoryCustom {
    List<PayEntity> findByMember(Long memberNo);

    List<PayEntity> findByRsvn(Long rsvnNo);

    List<Tuple> sumByMethodBetween(LocalDateTime startDateTime, LocalDateTime endDateTime);
}
