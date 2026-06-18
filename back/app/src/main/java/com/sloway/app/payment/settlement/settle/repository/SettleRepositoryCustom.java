package com.sloway.app.payment.settlement.settle.repository;

import com.sloway.app.payment.settlement.settle.common.SettleStatus;
import com.sloway.app.payment.settlement.settle.dto.response.SettleResDto;
import com.sloway.app.payment.settlement.settle.dto.response.SettleStatsResDto;
import com.sloway.app.payment.settlement.settle.entity.SettleEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface SettleRepositoryCustom {

    Optional<SettleEntity> findLatestByHostNo(Long hostNo);

    // 같은 호스트+기간 정산이 이미 있는지 — 스케줄러 재실행 시 중복 생성(이중 가산) 방지
    boolean existsByHostAndPeriod(Long hostNo, LocalDate start, LocalDate end);

    List<SettleEntity> findByHostNo(Long hostNo);

    List<SettleEntity> findByStatus(SettleStatus status);

    Page<SettleResDto> findSettleAll(PageRequest pageRequest, SettleStatus status);

    SettleStatsResDto findSettleStats();
}
