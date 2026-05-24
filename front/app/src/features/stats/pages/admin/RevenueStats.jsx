// 수익 통계 페이지 — 도메인: Stats / 역할: ADMIN
// 백엔드 API: ⏳ 미진입 (Stats 도메인 진입 X)
//            ✅ 본 도메인 본인 영역 — 4번 도메인 통계 영역

import PageLayout from '../../../../app/layouts/page/PageLayout';

export default function RevenueStats() {
  // TODO 1: useState
  //   - stats: 수익 통계 (mock 영역)
  //   - period: 기간 필터

  // TODO 2: Stats 도메인 미진입 — 완성 후 진입
  //   - findRevenueStats(period) 호출
  //   - 본인 4번 도메인 통계 — Pay/Refund/Settle 집계

  return (
    <PageLayout title="수익 통계" description="플랫폼 수익 현황을 분석합니다">
      {/* TODO 3: JSX */}
      {/*   - StatsPeriodFilter */}
      {/*   - VerticalBarChart (월별 매출 추이) */}
      {/*   - StatsDistribution (공간 타입별 / 결제 수단별) */}
      {/*   - StatCard (총 매출 / 수수료 / 환불 / 순이익) */}
    </PageLayout>
  );
}
