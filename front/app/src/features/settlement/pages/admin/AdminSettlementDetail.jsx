// 관리자 정산 상세 페이지 — 도메인: Settle / 역할: ADMIN
// 백엔드 API: 🚫 보류 (Settle 도메인 보류)
// URL: /admin/settlement/:no — useParams 활용

import { useParams } from 'react-router-dom';

import PageLayout from '../../../../app/layouts/page/PageLayout';

export default function AdminSettlementDetail() {
  const { no } = useParams();

  // TODO 1: useState
  //   - settlement: 단건 SettleResDto
  //   - bookings: 정산 대상 예약 배열

  // TODO 2: Settle 도메인 보류 — 완성 후 진입
  //   - findSettlementByNo(no) 호출

  return (
    <PageLayout
      title="정산 상세"
      backTo="/admin/settlement"
      backLabel="정산 관리"
      maxWidth={1200}
    >
      {/* TODO 3: JSX */}
      {/*   - SettlementDetailHeader */}
      {/*   - SettlementBookingsList */}
      {/*   - TaxInvoiceItem */}
      {/*   - 정산 강제 처리 / 취소 버튼 (관리자 권한) */}
    </PageLayout>
  );
}
