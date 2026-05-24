// 관리자 정산 목록 페이지 — 도메인: Settle / 역할: ADMIN
// 백엔드 API: 🚫 보류 (Settle 도메인 보류)

import PageLayout from '../../../../app/layouts/page/PageLayout';

export default function AdminSettlementList() {
  // TODO 1: useState
  //   - settlements: 전체 정산 배열 (SettleResDto[])
  //   - filter: 기간/호스트/상태 필터

  // TODO 2: Settle 도메인 보류 — 완성 후 진입
  //   - findSettlementAll() 호출

  return (
    <PageLayout
      title="정산 관리"
      description="모든 호스트 정산 내역을 관리합니다"
    >
      {/* TODO 3: JSX */}
      {/*   - SettlementFilterBar */}
      {/*   - RecentSettlementsTable (settlements 영역) */}
      {/*   - StatCard (총 정산 / 대기 / 완료 집계) */}
      {/*   - Pagination */}
    </PageLayout>
  );
}
