// 세금계산서 페이지 — 도메인: Settle / 역할: HOST
// 백엔드 API: 🚫 보류 (Settle 도메인 보류, issueTaxInvoice Rich 메서드만 작성)

import PageLayout from '../../../../app/layouts/page/PageLayout';

// 임시 hardcoded (로그인 API 완성 전까지)
const HOST_NO = 1;

export default function TaxInvoice() {
  // TODO 1: useState
  //   - invoices: 발행 내역 (SettleResDto[] status === INVOICE)

  // TODO 2: Settle 도메인 보류 — 완성 후 진입
  //   - findTaxInvoicesByHostNo(HOST_NO) 호출

  return (
    <PageLayout title="세금계산서" description="발행된 세금계산서를 확인하세요">
      {/* TODO 3: JSX */}
      {/*   - TaxInvoiceItem (invoices.map) */}
      {/*   - Pagination */}
    </PageLayout>
  );
}
