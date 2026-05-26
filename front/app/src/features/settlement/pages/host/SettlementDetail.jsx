import PageLayout from '../../../../app/layouts/page/PageLayout';

// Settle 도메인 보류 — 본인 4번 도메인 의존 깊이 차단 회피 결정 (6/8 이후 재개)
export default function SettlementDetail() {
  return (
    <PageLayout
      title="정산 상세"
      backTo="/host/settlement/history"
      backLabel="정산 내역"
      maxWidth={1000}
    />
  );
}
