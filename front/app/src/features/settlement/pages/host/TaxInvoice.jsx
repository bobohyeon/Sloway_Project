import PageLayout from '../../../../app/layouts/page/PageLayout';

// Settle 도메인 보류 — issueTaxInvoice Rich 메서드만 작성, API 미진입
export default function TaxInvoice() {
  return (
    <PageLayout title="세금계산서" description="발행된 세금계산서를 확인하세요" />
  );
}
