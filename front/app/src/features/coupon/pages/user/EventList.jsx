import PageLayout from '../../../../app/layouts/page/PageLayout';

export default function EventList() {
  // TODO 1: useState
  //   - events: 이벤트 배열 (mock 영역)

  // TODO 2: 백엔드 API 영역 없음 — 이벤트 도메인 신규 작성 시 진입

  return (
    <PageLayout title="이벤트" description="진행 중인 쿠폰 이벤트를 확인하세요">
      {/* TODO 3: JSX */}
      {/*   - EventCard (events.map) */}
      {/*   - EventTimeBadge (각 카드 안) */}
      {/*   - Tabs (진행 중 / 종료) */}
    </PageLayout>
  );
}
