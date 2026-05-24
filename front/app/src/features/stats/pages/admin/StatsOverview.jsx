// 통계 대시보드 페이지 — 도메인: Stats / 역할: ADMIN
// 백엔드 API: ⏳ 미진입 (Stats 도메인 진입 X, 6/8 시연 외 영역)
// 본 프로젝트 통합 단계 또는 진행 중 시간 점검 후 진입

import PageLayout from '../../../../app/layouts/page/PageLayout';

export default function StatsOverview() {
  // TODO 1: useState
  //   - overview: 통계 집계 데이터 (mock 영역)
  //   - period: 기간 필터

  // TODO 2: Stats 도메인 미진입 — 완성 후 진입
  //   - features/stats/api/statsApi.js 신규 작성 필요
  //   - findStatsOverview(period) 호출

  return (
    <PageLayout
      title="통계 대시보드"
      description="플랫폼 전체 지표를 한눈에 확인합니다"
    >
      {/* TODO 3: JSX */}
      {/*   - StatsPeriodFilter (기간 선택) */}
      {/*   - StatCard 4~6개 (총 회원 / 총 예약 / 총 매출 / 전월 대비 등) */}
      {/*   - VerticalBarChart / HorizontalBarChart */}
      {/*   - RankingList (인기 공간 / 우수 호스트) */}
    </PageLayout>
  );
}
