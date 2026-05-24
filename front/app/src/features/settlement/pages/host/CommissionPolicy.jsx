// 수수료 정책 페이지 — 도메인: Fee / 역할: HOST
// 백엔드 API: ✅ GET /api/settlement/fee (Fee 도메인, 연습 단계 종결)
// Fee 도메인은 본 프로젝트 이관 자산 — 본 프로젝트 통합 단계에서 정렬

import { useEffect, useState } from 'react';

import PageLayout from '../../../../app/layouts/page/PageLayout';

export default function CommissionPolicy() {
  // TODO 1: useState
  //   - fees: 공간 타입별 수수료 정책 (FeeResDto[])
  const [fees, setFees] = useState([]);

  // TODO 2: 마운트 시점 Fee 전체 조회
  //   - features/fee/api/feeApi.js 신규 작성 필요 (또는 settlement/api/feeApi.js)
  //   - 호출: const list = await findFeeAll();
  useEffect(() => {
    // TODO: api 호출 + setFees
  }, []);

  return (
    <PageLayout title="수수료 정책" description="공간 타입별 수수료 정책을 확인하세요">
      {/* TODO 3: JSX */}
      {/*   - CommissionPolicyTable (fees 영역) */}
      {/*   - PlaceType 별 수수료율 비교 */}
    </PageLayout>
  );
}
