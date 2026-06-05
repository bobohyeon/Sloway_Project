package com.sloway.app.payment.pay.repository;

import com.querydsl.core.Tuple;
import com.sloway.app.payment.pay.common.PayStatus;
import com.sloway.app.payment.pay.dto.response.MonthlySumDto;
import com.sloway.app.payment.pay.dto.response.PayResDto;
import com.sloway.app.payment.pay.dto.response.PayStatsResDto;
import com.sloway.app.payment.pay.entity.PayEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDateTime;
import java.util.List;

public interface PayRepositoryCustom {
    List<PayEntity> findByMember(Long memberNo);

    List<PayEntity> findByRsvn(Long rsvnNo);

    List<PayEntity> findByRsvnNoIn(List<Long> rsvnNos);

    List<Tuple> sumByMethodBetween(LocalDateTime startDateTime, LocalDateTime endDateTime);

    Long sumByOfficeIn(List<Long> officeNos, LocalDateTime start, LocalDateTime end);

    Long sumByStationIn(List<Long> stationNos, LocalDateTime start, LocalDateTime end);

    Long sumByWorkStayIn(List<Long> workStayNos, LocalDateTime start, LocalDateTime end);

    List<MonthlySumDto> sumByMonthBetween(List<Long> officeNos, List<Long> stationNos, List<Long> workStayNos, LocalDateTime start, LocalDateTime end);

    Long sumSalesStatsByOfficeIn(List<Long> officeNos, LocalDateTime start, LocalDateTime end);

    Long sumSalesStatsByStationIn(List<Long> stationNos, LocalDateTime start, LocalDateTime end);

    Long sumSalesStatsByWorkStayIn(List<Long> workStayNos, LocalDateTime start, LocalDateTime end);

    Page<PayResDto> findPayAll(PageRequest pageRequest, PayStatus status, java.time.LocalDateTime from);

    PayStatsResDto findPayStats(java.time.LocalDateTime from);

}
