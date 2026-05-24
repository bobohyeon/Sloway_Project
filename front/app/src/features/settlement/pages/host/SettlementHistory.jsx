// 정산 내역 페이지 — 도메인: Settle / 역할: HOST
// 백엔드 API: 🚫 보류 (Settle 도메인 보류)
// 의존: 호스트 도메인

import PageLayout from '../../../../app/layouts/page/PageLayout';

// 임시 hardcoded (로그인 API 완성 전까지)
const HOST_NO = 1;

export default function SettlementHistory() {
  // TODO 1: useState
  //   - settlements: 정산 배열 (SettleResDto[])
  //   - filter: 기간/상태 필터

  // TODO 2: Settle 도메인 보류 — 완성 후 진입
  //   - findSettlementsByHostNo(HOST_NO) 호출

  return (
    <PageLayout title="정산 내역" description="모든 정산 내역을 확인하세요">
      {/* TODO 3: JSX */}
      {/*   - SettlementFilterBar */}
      {/*   - SettlementCard (settlements.map) */}
      {/*   - Pagination */}
    </PageLayout>
  );
}
