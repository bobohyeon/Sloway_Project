package com.sloway.app.payment.stats.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// TODO: 통계 서비스
//       통계는 별도 Entity 없이 집계 쿼리 위주.
//       다른 도메인 Repository를 주입받거나, 별도 StatsRepository에 JPQL 작성.
//       → 본인이 필요에 따라 결정
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class StatsService {

    // TODO: 다른 도메인 Repository 주입 (예: PayRepository, RefundRepository ...)
    //       또는 StatsRepository 별도 생성

    // TODO: 메서드 정의
    //       예: findStatsByPeriod(LocalDate start, LocalDate end)
    //       예: findStatsByHost(Long hostNo)
}
