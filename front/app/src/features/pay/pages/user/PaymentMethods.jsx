// 결제 수단 관리 페이지 — 도메인: Pay / 역할: USER
// 백엔드 API: 🚫 별도 영역 없음 (Level 1 가짜결제, 결제 수단 저장 X)
// 본 페이지는 UI 시뮬레이션 영역 — Level 3 PG 진입 후 본격 구현 가능

import PageLayout from '../../../../app/layouts/page/PageLayout';

export default function PaymentMethods() {
  // TODO 1: useState
  //   - methods: 등록된 결제 수단 배열 (mock 영역, 본 단계 빈 배열)

  // TODO 2: 백엔드 API 영역 없음 — Level 3 PG 진입 후 진입
  //   - PaymentMethodCard / AddMethodCard 활용

  return (
    <PageLayout
      title="결제 수단 관리"
      description="등록된 결제 수단을 확인하세요"
    >
      {/* TODO 3: JSX */}
      {/*   - PaymentMethodCard (methods.map) */}
      {/*   - AddMethodCard (수단 추가 버튼) */}
      {/*   - 빈 영역 — Level 3 PG 진입 후 본격 구현 */}
    </PageLayout>
  );
}
