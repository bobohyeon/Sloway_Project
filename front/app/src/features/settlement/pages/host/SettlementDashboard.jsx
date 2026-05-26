import PageLayout from '../../../../app/layouts/page/PageLayout';

// Settle 도메인 보류 — 본인 4번 도메인 의존 깊이 차단 회피 결정 (6/8 이후 재개)
export default function SettlementDashboard() {
  return (
    <PageLayout
      title="정산 대시보드"
      description="이번 달 정산 현황을 확인하세요"
    />
  );
}
