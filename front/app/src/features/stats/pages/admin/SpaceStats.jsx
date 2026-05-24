// 공간 통계 페이지 — 도메인: Stats / 역할: ADMIN
// 백엔드 API: ⏳ 미진입 (Stats 도메인 진입 X)

import PageLayout from '../../../../app/layouts/page/PageLayout';

export default function SpaceStats() {
  // TODO 1: useState
  //   - stats: 공간 통계 (mock 영역)
  //   - period: 기간 필터

  // TODO 2: Stats 도메인 미진입 — 완성 후 진입
  //   - findSpaceStats(period) 호출

  return (
    <PageLayout title="공간 통계" description="공간 등록/이용 현황을 분석합니다">
      {/* TODO 3: JSX */}
      {/*   - StatsPeriodFilter */}
      {/*   - StatsDistribution (지역별 / 타입별) */}
      {/*   - RankingList (인기 공간 / 평점 우수) */}
      {/*   - StatCard (총 공간 / 신규 / 활성) */}
    </PageLayout>
  );
}
