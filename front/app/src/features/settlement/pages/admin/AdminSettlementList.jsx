import PageLayout from '../../../../app/layouts/page/PageLayout';

// Settle 도메인 보류 — 본인 4번 도메인 의존 깊이 차단 회피 결정 (6/8 이후 재개)
export default function AdminSettlementList() {
  return (
    <PageLayout
      title="정산 관리"
      description="모든 호스트 정산 내역을 관리합니다"
    />
  );
}
