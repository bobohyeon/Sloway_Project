//package com.sloway.app.payment.stats;
//
//import com.sloway.app.payment.pay.repository.PayRepository;
//import com.sloway.app.payment.stats.dto.response.MonthlyTrendResDto;
//import com.sloway.app.place.entity.hostPlace.ApprovalStatus;
//import com.sloway.app.place.entity.hostPlace.HostPlaceEntity;
//import com.sloway.app.place.repository.hostPlace.HostPlaceRepository;
//import jakarta.persistence.EntityManager;
//import jakarta.persistence.PersistenceContext;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.transaction.PlatformTransactionManager;
//import org.springframework.transaction.support.TransactionTemplate;
//
//import java.time.LocalDateTime;
//import java.time.YearMonth;
//import java.util.ArrayList;
//import java.util.Comparator;
//import java.util.List;
//import java.util.Map;
//import java.util.stream.Collectors;
//
//import static org.junit.jupiter.api.Assertions.assertEquals;
//
///**
// * 호스트 매출 6개월 추이 — 쿼리 최적화 전/후 성능 비교 테스트 (포트폴리오용)
// *
// * 같은 trend 계산을
// *   [개선 전] 6개월 루프 × (office+station+workStay) 3쿼리 = 18쿼리/회
// *   [개선 후] sumByMonthBetween GROUP BY 1쿼리/회
// * 로 각각 ITERATIONS(1000)번 돌려 총/평균 소요 시간과 개선 배율을 출력한다.
// *
// * ※ @Transactional 을 일부러 안 건다 — 1000번을 한 트랜잭션/한 세션으로 묶으면
// *   1차 캐시·커넥션 재사용으로 측정값이 비현실적으로 빨라진다. 대신 측정 루프 매 반복마다
// *   EntityManager.clear() 로 1차 캐시를 비워, 각 회차가 독립적으로 DB 를 치게 한다.
// *   (LAZY 연관 초기화가 필요한 "공간 번호 추출"만 TransactionTemplate 으로 트랜잭션 안에서 처리)
// *
// * ※ 측정 대상 호스트는 하드코딩하지 않고, DB 에서 "승인(A)된 공간이 가장 많은 호스트"를
// *   자동 선택한다. 시드 번호가 환경마다 달라도 데이터만 있으면 동작한다.
// *
// * ⚠ 정확한 측정을 위해 측정 중엔 SQL 로그를 꺼라 (로그 출력 비용이 측정값을 오염시킴):
// *    application.properties → spring.jpa.show-sql=false, logging.level.org.hibernate.SQL=OFF
// */
//@SpringBootTest
//class HostSalesStatsPerfTest {
//
//    @Autowired
//    private PayRepository payRepository;
//    @Autowired
//    private HostPlaceRepository hostPlaceRepository;
//    @Autowired
//    private PlatformTransactionManager txManager;
//
//    @PersistenceContext
//    private EntityManager em;
//
//    // ── 측정 파라미터 (실행 환경에 맞게 조정) ──
//    private static final int YEAR = 2026;
//    private static final int MONTH = 5;         // 기준월. 시드 분포(2025-06~2026-05)에 맞춰 5월 기준 → 추이 2025-12~2026-05 전부 데이터
//    private static final int MONTHS = 6;        // 추이 개월 수
//    private static final int ITERATIONS = 100;  // 측정 반복 횟수 (배율 비교엔 100회면 충분 — 더 보고 싶으면 올려라)
//    private static final int WARMUP = 5;        // JIT/커넥션 풀 예열 (측정값 안정화)
//
//    @Test
//    void compareTrendQueryPerformance() {
//        // 1) 공통 준비 — DB 에서 승인(A) 공간이 가장 많은 호스트를 골라 공간 번호를 추출.
//        //    getOfficeEntity() 등 LAZY 접근이 있어 이 블록만 트랜잭션 안에서 실행한다.
//        //    결과는 List<Long>(PK)뿐이라, 트랜잭션이 닫혀도 측정 루프에서 안전하게 쓸 수 있다.
//        TransactionTemplate tx = new TransactionTemplate(txManager);
//        SpaceNos nos = tx.execute(status -> {
//            List<HostPlaceEntity> approved = hostPlaceRepository.findAll().stream()
//                    .filter(hp -> hp.getStatus() == ApprovalStatus.A)
//                    .toList();
//            if (approved.isEmpty()) {
//                throw new IllegalStateException(
//                        "승인(A)된 HOST_PLACE 가 DB 에 없음. 공간 등록+승인 시드를 먼저 넣어라.");
//            }
//
//            // 승인 공간이 가장 많은 호스트 선택 (18쿼리 부담이 가장 잘 드러나는 대상)
//            List<HostPlaceEntity> hostPlaces = approved.stream()
//                    .collect(Collectors.groupingBy(hp -> hp.getHostEntity().getNo()))
//                    .values().stream()
//                    .max(Comparator.comparingInt(List::size))
//                    .orElseThrow();
//
//            List<Long> officeNos = hostPlaces.stream()
//                    .filter(hp -> hp.getOfficeEntity() != null)
//                    .map(hp -> hp.getOfficeEntity().getNo()).distinct().toList();
//            List<Long> stationNos = hostPlaces.stream()
//                    .filter(hp -> hp.getStationEntity() != null)
//                    .map(hp -> hp.getStationEntity().getNo()).distinct().toList();
//            List<Long> workStayNos = hostPlaces.stream()
//                    .filter(hp -> hp.getWorkStayEntity() != null)
//                    .map(hp -> hp.getWorkStayEntity().getNo()).distinct().toList();
//
//            System.out.printf("측정 대상 호스트 no=%d | 승인 공간 %d개 (office=%d, station=%d, workStay=%d)%n",
//                    hostPlaces.get(0).getHostEntity().getNo(), hostPlaces.size(),
//                    officeNos.size(), stationNos.size(), workStayNos.size());
//
//            return new SpaceNos(officeNos, stationNos, workStayNos);
//        });
//
//        YearMonth ym = YearMonth.of(YEAR, MONTH);
//        LocalDateTime start = ym.minusMonths(MONTHS - 1).atDay(1).atStartOfDay();
//        LocalDateTime end = ym.atEndOfMonth().atTime(23, 59, 59);
//
//        // 2) 결과값 동일성 검증 — 최적화가 "같은 답"을 내는지 (포트폴리오 신뢰성)
//        List<MonthlyTrendResDto> before = trendBefore(nos, ym);
//        List<MonthlyTrendResDto> after = trendAfter(nos, start, end, ym);
//        assertEquals(before.size(), after.size());
//        for (int i = 0; i < before.size(); i++) {
//            assertEquals(before.get(i).getYearMonth(), after.get(i).getYearMonth());
//            assertEquals(before.get(i).getTotalAmt(), after.get(i).getTotalAmt(),
//                    "월별 합계가 개선 전/후 달라짐: " + before.get(i).getYearMonth());
//        }
//
//        // 3) 워밍업 — JIT 컴파일·커넥션 풀·DB 버퍼 캐시 예열
//        for (int i = 0; i < WARMUP; i++) {
//            trendBefore(nos, ym);
//            em.clear();
//            trendAfter(nos, start, end, ym);
//            em.clear();
//        }
//
//        // 4) 개선 전(18쿼리/회) ITERATIONS 번 측정 — 매 반복 후 1차 캐시 비움
//        long t1 = System.nanoTime();
//        for (int i = 0; i < ITERATIONS; i++) {
//            trendBefore(nos, ym);
//            em.clear();
//        }
//        long beforeNanos = System.nanoTime() - t1;
//
//        // 5) 개선 후(1쿼리/회) ITERATIONS 번 측정 — 매 반복 후 1차 캐시 비움
//        long t2 = System.nanoTime();
//        for (int i = 0; i < ITERATIONS; i++) {
//            trendAfter(nos, start, end, ym);
//            em.clear();
//        }
//        long afterNanos = System.nanoTime() - t2;
//
//        // 6) 결과 출력
//        double beforeMs = beforeNanos / 1_000_000.0;
//        double afterMs = afterNanos / 1_000_000.0;
//        System.out.println();
//        System.out.println("========== 호스트 매출 추이 쿼리 성능 비교 ==========");
//        System.out.printf("반복 횟수          : %,d 회%n", ITERATIONS);
//        System.out.printf("개선 전 (18쿼리/회) : 총 %,.1f ms | 평균 %.3f ms/회 | 누적 쿼리 %,d 개%n",
//                beforeMs, beforeMs / ITERATIONS, ITERATIONS * 3L * MONTHS);
//        System.out.printf("개선 후 (1쿼리/회)  : 총 %,.1f ms | 평균 %.3f ms/회 | 누적 쿼리 %,d 개%n",
//                afterMs, afterMs / ITERATIONS, (long) ITERATIONS);
//        System.out.printf("개선 배율          : %.1f 배 빠름 (%.1f%% 단축)%n",
//                beforeMs / afterMs, (1 - afterMs / beforeMs) * 100);
//        System.out.println("====================================================");
//        System.out.println();
//    }
//
//    // [개선 전] 달마다 DB 3쿼리(office/station/workStay) → 6개월 = 18쿼리
//    private List<MonthlyTrendResDto> trendBefore(SpaceNos nos, YearMonth ym) {
//        List<MonthlyTrendResDto> trend = new ArrayList<>();
//        for (int i = MONTHS - 1; i >= 0; i--) {
//            YearMonth m = ym.minusMonths(i);
//            LocalDateTime mStart = m.atDay(1).atStartOfDay();
//            LocalDateTime mEnd = m.atEndOfMonth().atTime(23, 59, 59);
//            long total = payRepository.sumByOfficeIn(nos.office(), mStart, mEnd)
//                    + payRepository.sumByStationIn(nos.station(), mStart, mEnd)
//                    + payRepository.sumByWorkStayIn(nos.workStay(), mStart, mEnd);
//            trend.add(MonthlyTrendResDto.of(m.toString(), total));
//        }
//        return trend;
//    }
//
//    // [개선 후] GROUP BY 1쿼리로 월별 합계 Map 준비 → 루프는 DB 대신 Map 만 읽음
//    private List<MonthlyTrendResDto> trendAfter(SpaceNos nos, LocalDateTime start,
//                                                LocalDateTime end, YearMonth ym) {
//        Map<String, Long> monthly = payRepository
//                .sumByMonthBetween(nos.office(), nos.station(), nos.workStay(), start, end)
//                .stream()
//                .collect(Collectors.toMap(
//                        m -> m.getMonth(),
//                        m -> {
//                            Long v = m.getSum();
//                            return v == null ? 0L : v;
//                        }));
//        List<MonthlyTrendResDto> trend = new ArrayList<>();
//        for (int i = MONTHS - 1; i >= 0; i--) {
//            YearMonth m = ym.minusMonths(i);
//            trend.add(MonthlyTrendResDto.of(m.toString(), monthly.getOrDefault(m.toString(), 0L)));
//        }
//        return trend;
//    }
//
//    // 호스트 공간 PK 묶음 (트랜잭션 안에서 추출 → 루프에서 재사용)
//    private record SpaceNos(List<Long> office, List<Long> station, List<Long> workStay) {
//    }
//}
