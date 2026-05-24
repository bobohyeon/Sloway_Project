// 호스트 매출 통계 페이지 — 도메인: Stats / 역할: HOST
// 백엔드 API: ⏳ 미진입 (Stats 도메인 진입 X)
// 의존: 호스트 도메인

import PageLayout from '../../../../app/layouts/page/PageLayout';

// 임시 hardcoded (로그인 API 완성 전까지)
const HOST_NO = 1;

export default function SalesStats() {
  // TODO 1: useState
  //   - stats: 호스트 매출 통계 (mock 영역)
  //   - period: 기간 필터

  // TODO 2: Stats 도메인 미진입 — 완성 후 진입
  //   - findHostSalesStats(HOST_NO, period) 호출

  return (
    <PageLayout title="매출 통계" description="내 공간의 매출 현황을 확인하세요">
      {/* TODO 3: JSX */}
      {/*   - StatsPeriodFilter */}
      {/*   - VerticalBarChart (일/주/월별 매출 추이) */}
      {/*   - HorizontalBarChart (공간별 매출 비교) */}
      {/*   - StatCard (총 매출 / 예약 건수 / 평균 객단가 / 정산 예정액) */}
    </PageLayout>
  );
}
