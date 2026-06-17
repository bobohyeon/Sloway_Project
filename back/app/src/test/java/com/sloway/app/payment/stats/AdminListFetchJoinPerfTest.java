//package com.sloway.app.payment.stats;
//
//import com.querydsl.jpa.impl.JPAQueryFactory;
//import com.sloway.app.payment.pay.common.PayStatus;
//import com.sloway.app.payment.pay.dto.response.PayResDto;
//import com.sloway.app.payment.pay.entity.QPayEntity;
//import com.sloway.app.payment.pay.repository.PayRepository;
//import com.sloway.app.payment.refund.dto.response.RefundResDto;
//import com.sloway.app.payment.refund.entity.QRefundEntity;
//import com.sloway.app.payment.refund.repository.RefundRepository;
//import jakarta.persistence.EntityManagerFactory;
//import jakarta.persistence.PersistenceUnit;
//import org.hibernate.SessionFactory;
//import org.hibernate.stat.Statistics;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.test.context.TestPropertySource;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.transaction.PlatformTransactionManager;
//import org.springframework.transaction.support.TransactionTemplate;
//
//import java.util.List;
//import java.util.function.Supplier;
//
///**
// * 어드민 결제·환불 목록 — fetch join 적용 전/후 성능 비교 테스트 (포트폴리오용 #2)
// *
// * 같은 목록 조회를
// *   [개선 전] 목록 1쿼리 + 행마다 LAZY 연관(rsvn → member·공간) N+1 = 약 1 + PAGE_SIZE×3 (+count 1)
// *   [개선 후] leftJoin(...).fetchJoin() 으로 한 쿼리에 다 끌어옴 = 2쿼리(목록 + count)
// * 로 측정한다. fetch join 은 GROUP BY(6/5 사례)와 다른 두 번째 최적화 기법.
// *
// * 핵심 측정 지표는 "시간"보다 "쿼리 수" — N+1 은 쿼리 왕복 횟수가 본질이라
// * Hibernate Statistics 의 PrepareStatementCount 로 before/after 쿼리 수를 직접 센다.
// *
// * ※ before/after 둘 다 트랜잭션 안에서 돌린다 — from() 이 LAZY 연관에 접근하므로
// *   영속성 컨텍스트가 열려 있어야 N+1 이 재현된다(닫혀 있으면 LazyInitializationException).
// *   그리고 매 회차를 별도 트랜잭션(TransactionTemplate)으로 감싸, 트랜잭션이 끝날 때마다
// *   1차 캐시가 비워지게 한다. 한 트랜잭션으로 1000번 묶으면 2회차부터 캐시 히트라 N+1 이 사라져
// *   측정이 비현실적으로 빨라진다.
// *
// * ⚠ 정확한 측정을 위해 측정 중엔 SQL 로그를 꺼라(로그 출력 비용이 측정값을 오염):
// *    application.properties → spring.jpa.show-sql=false, logging.level.org.hibernate.SQL=OFF
// * ⚠ 시드 데이터가 적으면 PAGE_SIZE 만큼 행이 안 차서 N+1 효과가 작다. 목록에 행이 충분한지 먼저 확인.
// */
//@SpringBootTest
//@TestPropertySource(properties = {              // 측정 중 SQL 로그 OFF (로그 비용이 측정값 오염 방지)
//        "spring.jpa.show-sql=false",
//        "logging.level.org.hibernate.SQL=OFF"
//})
//class AdminListFetchJoinPerfTest {
//
//    @Autowired
//    private PayRepository payRepository;
//    @Autowired
//    private RefundRepository refundRepository;
//    @Autowired
//    private JPAQueryFactory jpaQueryFactory;
//    @Autowired
//    private PlatformTransactionManager txManager;
//
//    @PersistenceUnit
//    private EntityManagerFactory emf;
//
//    private static final QPayEntity qPay = QPayEntity.payEntity;
//    private static final QRefundEntity qRefund = QRefundEntity.refundEntity;
//
//    // ── 측정 파라미터 ──
//    private static final int PAGE_SIZE = 10;     // 운영 어드민 목록 사이즈와 동일(PageRequest.of(pno, 10)).
//                                                 // 100 으로 키우면 N+1 스트레스 측정(쿼리 수가 페이지 크기에 비례 → 시간차도 극적).
//                                                 // 측정 실측(2026-06-11): 10 → 32→2쿼리(16배) / 100 → 202→2쿼리(101배, 시간 54~74% 단축)
//    private static final int ITERATIONS = 100;   // 시간 측정 반복 횟수
//    private static final int WARMUP = 5;         // JIT/커넥션 풀 예열
//
//    private TransactionTemplate tx;
//
//    @Test
//    void comparePayListPerformance() {
//        tx = readOnlyTx();
//        System.out.println("\n########## 어드민 결제 목록 (findPayAll) fetch join 전/후 ##########");
//        run("결제", this::payBefore, this::payAfter);
//    }
//
//    @Test
//    void compareRefundListPerformance() {
//        tx = readOnlyTx();
//        System.out.println("\n########## 어드민 환불 목록 (findRefundAll) fetch join 전/후 ##########");
//        run("환불", this::refundBefore, this::refundAfter);
//    }
//
//    // 공통 측정 루틴 — 결과 동일성 검증 → 쿼리 수 측정 → 시간 측정 → 출력
//    private void run(String label, Supplier<List<?>> before, Supplier<List<?>> after) {
//        // 1) 결과 동일성 — 최적화가 "같은 행 수"를 내는지(포트폴리오 신뢰성)
//        int beforeSize = tx.execute(s -> before.get().size());
//        int afterSize = tx.execute(s -> after.get().size());
//        if (beforeSize != afterSize) {
//            throw new IllegalStateException(label + " 결과 행 수 불일치: before=" + beforeSize + ", after=" + afterSize);
//        }
//        if (beforeSize == 0) {
//            System.out.printf("[%s] 목록이 비어 있음 — 시드 데이터를 먼저 넣어라(N+1 효과 안 보임).%n", label);
//        }
//
//        // 2) 쿼리 수 측정 — before/after 각 1회, Statistics 의 PrepareStatementCount 차이
//        long beforeQueries = countQueries(before);
//        long afterQueries = countQueries(after);
//
//        // 3) 워밍업
//        for (int i = 0; i < WARMUP; i++) {
//            tx.execute(s -> before.get());
//            tx.execute(s -> after.get());
//        }
//
//        // 4) 시간 측정 — 매 회차 별도 트랜잭션(1차 캐시 격리)
//        long t1 = System.nanoTime();
//        for (int i = 0; i < ITERATIONS; i++) tx.execute(s -> before.get());
//        double beforeMs = (System.nanoTime() - t1) / 1_000_000.0;
//
//        long t2 = System.nanoTime();
//        for (int i = 0; i < ITERATIONS; i++) tx.execute(s -> after.get());
//        double afterMs = (System.nanoTime() - t2) / 1_000_000.0;
//
//        // 5) 출력
//        System.out.printf("페이지 크기        : %d 행%n", PAGE_SIZE);
//        System.out.printf("반복 횟수          : %,d 회%n", ITERATIONS);
//        System.out.printf("개선 전 (N+1)      : %,d 쿼리/회 | 총 %,.1f ms | 평균 %.3f ms/회%n",
//                beforeQueries, beforeMs, beforeMs / ITERATIONS);
//        System.out.printf("개선 후 (fetchJoin): %,d 쿼리/회 | 총 %,.1f ms | 평균 %.3f ms/회%n",
//                afterQueries, afterMs, afterMs / ITERATIONS);
//        System.out.printf("쿼리 수 감소       : %,d → %,d (%.1f배)%n",
//                beforeQueries, afterQueries, afterQueries == 0 ? 0 : (double) beforeQueries / afterQueries);
//        System.out.printf("시간 개선          : %.1f배 빠름 (%.1f%% 단축)%n",
//                afterMs == 0 ? 0 : beforeMs / afterMs, afterMs == 0 ? 0 : (1 - afterMs / beforeMs) * 100);
//        System.out.println("================================================================");
//    }
//
//    // Statistics 로 한 회차의 실행 쿼리(PreparedStatement) 수를 센다
//    private long countQueries(Supplier<List<?>> work) {
//        Statistics stats = emf.unwrap(SessionFactory.class).getStatistics();
//        stats.setStatisticsEnabled(true);
//        stats.clear();
//        tx.execute(s -> work.get());
//        return stats.getPrepareStatementCount();
//    }
//
//    // ── [개선 전] fetch join 없이 목록만 가져온 뒤 from() 에서 LAZY 연관 접근 → N+1 ──
//    private List<PayResDto> payBefore() {
//        List<PayResDto> list = jpaQueryFactory
//                .selectFrom(qPay)
//                .where(qPay.status.ne(PayStatus.READY))      // findPayAll 과 동일 필터(탭/기간 null 기준)
//                .orderBy(qPay.no.desc())
//                .offset(0)
//                .limit(PAGE_SIZE)
//                .fetch()
//                .stream()
//                .map(PayResDto::from)                         // 행마다 rsvn → member·공간 LAZY 로딩
//                .toList();
//        // count 도 findPayAll 과 맞춰 1회(공정 비교)
//        jpaQueryFactory.select(qPay.count()).from(qPay).where(qPay.status.ne(PayStatus.READY)).fetchOne();
//        return list;
//    }
//
//    // ── [개선 후] 실제 운영 메서드 그대로 호출(fetch join 적용본) ──
//    private List<PayResDto> payAfter() {
//        return payRepository.findPayAll(PageRequest.of(0, PAGE_SIZE), null, null).getContent();
//    }
//
//    private List<RefundResDto> refundBefore() {
//        List<RefundResDto> list = jpaQueryFactory
//                .selectFrom(qRefund)                          // tab=null → 필터 없음(findRefundAll 의 all 탭과 동일)
//                .orderBy(qRefund.no.desc())
//                .offset(0)
//                .limit(PAGE_SIZE)
//                .fetch()
//                .stream()
//                .map(RefundResDto::from)
//                .toList();
//        jpaQueryFactory.select(qRefund.count()).from(qRefund).fetchOne();
//        return list;
//    }
//
//    private List<RefundResDto> refundAfter() {
//        return refundRepository.findRefundAll(PageRequest.of(0, PAGE_SIZE), null, null).getContent();
//    }
//
//    private TransactionTemplate readOnlyTx() {
//        TransactionTemplate t = new TransactionTemplate(txManager);
//        t.setReadOnly(true);
//        return t;
//    }
//}
