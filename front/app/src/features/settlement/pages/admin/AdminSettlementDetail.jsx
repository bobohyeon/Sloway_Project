import PageLayout from '../../../../app/layouts/page/PageLayout';

// Settle 도메인 보류 — 본인 4번 도메인 의존 깊이 차단 회피 결정 (6/8 이후 재개)
export default function AdminSettlementDetail() {
  return (
    <PageLayout
      title="정산 상세"
      backTo="/admin/settlement/host"
      backLabel="정산 관리"
      maxWidth={1200}
    />
  );
}
