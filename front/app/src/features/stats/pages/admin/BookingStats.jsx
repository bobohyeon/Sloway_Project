// 예약 통계 페이지 — 도메인: Stats / 역할: ADMIN
// 백엔드 API: ⏳ 미진입 (Stats 도메인 진입 X)

import PageLayout from '../../../../app/layouts/page/PageLayout';

export default function BookingStats() {
  // TODO 1: useState
  //   - stats: 예약 통계 (mock 영역)
  //   - period: 기간 필터

  // TODO 2: Stats 도메인 미진입 — 완성 후 진입
  //   - findBookingStats(period) 호출

  return (
    <PageLayout title="예약 통계" description="예약 발생 현황을 분석합니다">
      {/* TODO 3: JSX */}
      {/*   - StatsPeriodFilter */}
      {/*   - VerticalBarChart (일/주/월별 예약 추이) */}
      {/*   - StatsDistribution (공간 타입별 분포) */}
      {/*   - StatCard (총 예약 / 평균 객단가 / 취소율) */}
    </PageLayout>
  );
}
