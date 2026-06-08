import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { findPointBalanceByMemberNo } from '../../point/api/pointApi';
import { findCouponsByMemberNo } from '../../coupon/api/couponApi';

/**
 * 마이페이지 홈 요약 정보(포인트·쿠폰) 병렬 조회 훅.
 * 일부 API가 실패해도 나머지는 표시되도록 allSettled로 독립 처리.
 * (예약은 프론트 API 함수 준비되면 추가 예정)
 * @param {number|undefined} memberNo 토큰의 회원번호
 */
export function useMyPageSummary(memberNo) {
  const [point, setPoint] = useState(0);
  const [couponCount, setCouponCount] = useState(0);
  const [loading, setLoading] = useState(true);
  // 페이지 이동마다 재조회 — 네브바는 레이아웃 상주라 pathname 변화를 갱신 트리거로 사용
  const { pathname } = useLocation();

  useEffect(() => {
    if (!memberNo) return; // 토큰 준비 전엔 호출 안 함
    let alive = true;

    (async () => {
      const [pointR, couponR] = await Promise.allSettled([
        findPointBalanceByMemberNo(memberNo),
        findCouponsByMemberNo(memberNo),
      ]);

      if (!alive) return;

      if (pointR.status === 'fulfilled') setPoint(pointR.value?.balance ?? 0);
      if (couponR.status === 'fulfilled')
        setCouponCount(couponR.value?.length ?? 0);

      setLoading(false);
    })();

    return () => {
      alive = false;
    };
  }, [memberNo, pathname]);

  return { point, couponCount, loading };
}
