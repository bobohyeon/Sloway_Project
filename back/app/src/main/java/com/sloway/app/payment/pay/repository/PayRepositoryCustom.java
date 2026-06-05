package com.sloway.app.payment.pay.repository;

import com.querydsl.core.Tuple;
import com.sloway.app.payment.pay.common.PayStatus;
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

    // 여러 예약의 결제를 한 번에 조회 — 예약 목록의 N+1(예약마다 findByRsvn) 제거용
    List<PayEntity> findByRsvnNoIn(List<Long> rsvnNos);

    List<Tuple> sumByMethodBetween(LocalDateTime startDateTime, LocalDateTime endDateTime);

    Long sumByOfficeIn(List<Long> officeNos, LocalDateTime start, LocalDateTime end);

    Long sumByStationIn(List<Long> stationNos, LocalDateTime start, LocalDateTime end);

    Long sumByWorkStayIn(List<Long> workStayNos, LocalDateTime start, LocalDateTime end);

    Long sumSalesStatsByOfficeIn(List<Long> officeNos, LocalDateTime start, LocalDateTime end);

    Long sumSalesStatsByStationIn(List<Long> stationNos, LocalDateTime start, LocalDateTime end);

    Long sumSalesStatsByWorkStayIn(List<Long> workStayNos, LocalDateTime start, LocalDateTime end);

    // 목록 조회 — status/from 이 null 이면 해당 조건 무시(전체)
    Page<PayResDto> findPayAll(PageRequest pageRequest, PayStatus status, java.time.LocalDateTime from);

    // 통계 집계 — 기간(from) 내 상태별 건수·금액
    PayStatsResDto findPayStats(java.time.LocalDateTime from);

}
