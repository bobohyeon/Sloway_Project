// 포인트 내역 페이지 — 도메인: Point / 역할: USER
// 백엔드 API: ✅ GET /api/payment/point/member/{no}/balance (잔액, 어제 종결)
//            ⏳ 내역 조회 API 영역 — 신규 작성 필요 (PointService.findPointsByMemberNo)
// 의존: 회원 도메인 (로그인 완성 전까지 hardcoded)

import { useEffect, useState } from 'react';

import PageLayout from '../../../../app/layouts/page/PageLayout';

import { findPointBalanceByMemberNo } from '../../api/pointApi';

// 임시 hardcoded (로그인 API 완성 전까지)
const MEMBER_NO = 1;

export default function PointHistory() {
  // TODO 1: useState
  //   - balance: 잔액 (Integer)
  //   - histories: 적립/사용/만료 내역 (PointResDto[])
  //   - filter: SAVE / USE / EXPIRATION 탭 필터
  const [balance, setBalance] = useState(0);
  const [histories, setHistories] = useState([]);

  // TODO 2: 마운트 시점 잔액 + 내역 호출 (Promise.all 병렬)
  //   - 내역 API 신규 작성 후 호출
  useEffect(() => {
    const load = async () => {
      try {
        const balanceResDto = await findPointBalanceByMemberNo(MEMBER_NO);
        setBalance(balanceResDto.balance);
        // TODO: findPointsByMemberNo(MEMBER_NO) 호출 + setHistories
      } catch (err) {
        console.error('포인트 내역 조회 실패', err);
      }
    };
    load();
  }, []);

  return (
    <PageLayout title="포인트 내역" description="포인트 적립/사용 내역을 확인하세요">
      {/* TODO 3: JSX */}
      {/*   - PointBalance (balance 노출) */}
      {/*   - PointExpiringSoon (만료 임박 영역) */}
      {/*   - PointStatsRow (적립/사용 집계) */}
      {/*   - PointPolicyNotice (정책 안내) */}
      {/*   - Tabs (전체 / 적립 / 사용 / 만료) */}
      {/*   - PointHistoryItem (histories.map) */}
    </PageLayout>
  );
}
