// 정산 계좌 페이지 — 도메인: Settle / 역할: HOST
// 백엔드 API: 🚫 별도 영역 없음 (계좌 영역은 호스트 도메인 영역, Settle 외)
// 의존: 호스트 도메인

import PageLayout from '../../../../app/layouts/page/PageLayout';

// 임시 hardcoded (로그인 API 완성 전까지)
const HOST_NO = 1;

export default function SettlementAccount() {
  // TODO 1: useState
  //   - account: 정산 계좌 정보 (mock 영역)

  // TODO 2: 백엔드 호스트 계좌 API 활용 (회원/호스트 도메인 의존)
  //   - 계좌 등록/수정/인증 영역

  return (
    <PageLayout title="정산 계좌" description="정산받을 계좌를 관리하세요">
      {/* TODO 3: JSX */}
      {/*   - AccountCard (계좌 정보) */}
      {/*   - AccountVerifyModal (계좌 인증) */}
    </PageLayout>
  );
}
