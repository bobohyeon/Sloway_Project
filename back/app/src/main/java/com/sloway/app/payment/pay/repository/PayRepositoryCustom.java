package com.sloway.app.payment.pay.repository;

import com.querydsl.core.Tuple;
import com.sloway.app.payment.pay.entity.PayEntity;

import java.time.LocalDateTime;
import java.util.List;

public interface PayRepositoryCustom {
    List<PayEntity> findByMember(Long memberNo);

    List<PayEntity> findByRsvn(Long rsvnNo);

    List<Tuple> sumByMethodBetween(LocalDateTime startDateTime, LocalDateTime endDateTime);

    Integer sumByOfficeIn(List<Long> officeNos, LocalDateTime start, LocalDateTime end);

    Integer sumByStationIn(List<Long> stationNos, LocalDateTime start, LocalDateTime end);

    Integer sumByWorkStayIn(List<Long> workStayNos, LocalDateTime start, LocalDateTime end);

    Long sumSalesStatsByOfficeIn(List<Long> officeNos, LocalDateTime start, LocalDateTime end);

    Long sumSalesStatsByStationIn(List<Long> stationNos, LocalDateTime start, LocalDateTime end);

    Long sumSalesStatsByWorkStayIn(List<Long> workStayNos, LocalDateTime start, LocalDateTime end);
}
