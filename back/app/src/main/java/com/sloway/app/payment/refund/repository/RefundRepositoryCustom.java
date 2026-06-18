package com.sloway.app.payment.refund.repository;

import com.querydsl.core.Tuple;
import com.sloway.app.payment.refund.common.RefundStatus;
import com.sloway.app.payment.refund.dto.response.RefundResDto;
import com.sloway.app.payment.refund.dto.response.RefundStatsResDto;
import com.sloway.app.payment.refund.entity.RefundEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface RefundRepositoryCustom {

    boolean existsByPayAndStatus(Long payNo, List<RefundStatus> refundStatuses);

    List<RefundEntity> findByMember(Long memberNo);

    // 결제 1건의 연관 환불 단건 조회 — 환불 없는 결제도 있으므로 없으면 null
    RefundEntity findByPay(Long payNo);

    // 어드민 환불 목록 — fetch join(N+1 제거) + 탭/기간 필터 + 서버 페이징
    Page<RefundResDto> findRefundAll(PageRequest pageRequest, String tab, LocalDateTime from);

    // 어드민 환불 통계 (탭/기간 무관 전체 상태별 집계)
    RefundStatsResDto findRefundStats();

    Tuple sumBetween(LocalDateTime startDateTime, LocalDateTime endDateTime);

    BigDecimal sumByOfficeIn(List<Long> officeNos, LocalDateTime start, LocalDateTime end);

    BigDecimal sumByStationIn(List<Long> stationNos, LocalDateTime start, LocalDateTime end);

    BigDecimal sumByWorkStayIn(List<Long> workStayNos, LocalDateTime start, LocalDateTime end);
}
