// 정산 상세 페이지 — 도메인: Settle / 역할: HOST
// 백엔드 API: 🚫 보류 (Settle 도메인 보류)
// URL: /host/settlement/:no — useParams 활용

import { useParams } from 'react-router-dom';

import PageLayout from '../../../../app/layouts/page/PageLayout';

export default function SettlementDetail() {
  const { no } = useParams();

  // TODO 1: useState
  //   - settlement: 단건 SettleResDto
  //   - bookings: 정산 대상 예약 배열

  // TODO 2: Settle 도메인 보류 — 완성 후 진입
  //   - findSettlementByNo(no) 호출

  return (
    <PageLayout
      title="정산 상세"
      backTo="/host/settlement"
      backLabel="정산 내역"
      maxWidth={1000}
    >
      {/* TODO 3: JSX */}
      {/*   - SettlementDetailHeader */}
      {/*   - SettlementBookingsList (정산 대상 예약 목록) */}
      {/*   - TaxInvoiceItem (세금계산서 영역) */}
    </PageLayout>
  );
}
