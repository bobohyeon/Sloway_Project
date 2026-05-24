// 정산 대시보드 페이지 — 도메인: Settle / 역할: HOST
// 백엔드 API: 🚫 보류 (Settle 도메인 본인 결정 보류 — 의존 깊이 host→place→rsvn 차단)
//            🚫 보류 — 6/8 시연 이후 또는 본 프로젝트 통합 단계 진입
// 의존: 호스트 도메인 (로그인 완성 전까지 hardcoded)

import PageLayout from '../../../../app/layouts/page/PageLayout';

// 임시 hardcoded (로그인 API 완성 전까지)
const HOST_NO = 1;

export default function SettlementDashboard() {
  // TODO 1: useState
  //   - dashboard: 정산 대시보드 데이터 (mock 영역)
  //   - period: 기간 필터 (월/주)

  // TODO 2: 백엔드 Settle 도메인 보류 — 완성 후 진입
  //   - settlementApi 신규 작성 필요 (features/settlement/api/settlementApi.js)
  //   - 호출: findSettlementDashboard(HOST_NO, period)

  return (
    <PageLayout title="정산 대시보드" description="이번 달 정산 현황을 확인하세요">
      {/* TODO 3: JSX */}
      {/*   - SettlementStatCard 4개 (총 매출 / 정산 완료 / 정산 예정 / 수수료) */}
      {/*   - MonthlySalesChart */}
      {/*   - SettlementSchedule (다음 정산일) */}
      {/*   - RecentSettlementsTable */}
      {/*   - QuickActionCard 묶음 */}
    </PageLayout>
  );
}
