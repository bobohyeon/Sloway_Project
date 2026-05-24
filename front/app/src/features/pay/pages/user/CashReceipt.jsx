// 현금영수증 페이지 — 도메인: Pay / 역할: USER
// 백엔드 API: 🚫 별도 영역 없음 (Level 1 가짜결제 영역 외)
// 본 페이지는 UI 시뮬레이션 영역 — Level 3 PG 진입 후 본격 구현 가능

import PageLayout from '../../../../app/layouts/page/PageLayout';

export default function CashReceipt() {
  // TODO 1: useState
  //   - receipts: 현금영수증 발급 내역 (mock 영역)

  // TODO 2: 백엔드 API 영역 없음 — Level 3 PG 진입 후 진입

  return (
    <PageLayout
      title="현금영수증"
      description="현금영수증 발급 내역을 확인하세요"
    >
      {/* TODO 3: JSX */}
      {/*   - CashReceiptInfo (수단 정보) */}
      {/*   - CashReceiptItem (receipts.map) */}
    </PageLayout>
  );
}
