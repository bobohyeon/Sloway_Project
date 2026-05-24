// 회원 통계 페이지 — 도메인: Stats / 역할: ADMIN
// 백엔드 API: ⏳ 미진입 (Stats 도메인 진입 X)

import PageLayout from '../../../../app/layouts/page/PageLayout';

export default function MemberStats() {
  // TODO 1: useState
  //   - stats: 회원 통계 (mock 영역)
  //   - period: 기간 필터

  // TODO 2: Stats 도메인 미진입 — 완성 후 진입
  //   - findMemberStats(period) 호출

  return (
    <PageLayout title="회원 통계" description="회원 가입/활동 현황을 분석합니다">
      {/* TODO 3: JSX */}
      {/*   - StatsPeriodFilter */}
      {/*   - VerticalBarChart (가입 추이) */}
      {/*   - StatsDistribution (연령대 / 성별 / 지역) */}
      {/*   - StatCard (총 회원 / 신규 / 활성 / 휴면) */}
    </PageLayout>
  );
}
