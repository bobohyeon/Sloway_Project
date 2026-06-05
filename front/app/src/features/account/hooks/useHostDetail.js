import { useState, useEffect, useCallback } from 'react';
import {
  getAdminHostDetail,
  revokeHost,
  restoreHost,
  getAdminHostStats, // 4번 — 매출/월별 추이
  getAdminHostSettleList, // 4번 — 정산목록(미정산 집계)
  getAdminHostAccount, // 4번 — 계좌
  getAdminHostSpaces, // 서현진 — 공간 목록/개수
  getAdminHostReservationStats, // 보현 — 예약 건수
  getAdminHostReviewStats, // 보현 — 평점/리뷰수
} from '../api/adminApi';

// 백엔드 approvalState(P/A/R/V) → 화면 상태값 매핑 (useHostList와 동일)
const STATE_MAP = {
  P: 'PENDING',
  A: 'ACTIVE',
  R: 'REJECTED',
  V: 'REVOKED',
};

// 계좌번호 마스킹 — 민감 개인정보라 뒤 4자리만 노출 (예: ****1234)
// 어드민도 풀번호를 볼 필요는 없음. 식별엔 뒤 4자리로 충분.
const maskAccountNo = (no) =>
  !no || no === '-' ? '-' : '****' + String(no).slice(-4);

/**
 * 어드민 — 호스트 상세 조회 훅.
 *
 * 백엔드(GET /api/admin/hosts/{id})가 주는 필드: 사업자정보·회원정보·승인상태.
 * 운영데이터(공간/예약/정산/리뷰)는 타 도메인 소관 → A안(각 도메인 어드민 엔드포인트)으로 받음.
 * 6개 운영데이터를 Promise.allSettled로 병렬 호출 (하나 실패해도 나머지는 그려짐).
 */
export const useHostDetail = (hostId) => {
  const [host, setHost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null); // 재호출 시 이전 에러 초기화

      // ── 병렬 호출 ── 기본정보(필수) + 운영데이터(옵셔널)
      const now = new Date();
      const [
        detailRes,
        statsRes, // 4번 — 매출/월별
        settleRes, // 4번 — 정산목록(미정산)
        accountRes, // 4번 — 계좌
        spacesRes, // 서현진 — 공간 목록
        reservationRes, // 보현 — 예약 건수
        reviewRes, // 보현 — 리뷰 평점/개수
      ] = await Promise.allSettled([
        getAdminHostDetail(hostId),
        getAdminHostStats(hostId, now.getFullYear(), now.getMonth() + 1, 12),
        getAdminHostSettleList(hostId),
        getAdminHostAccount(hostId),
        getAdminHostSpaces(hostId),
        getAdminHostReservationStats(hostId),
        getAdminHostReviewStats(hostId),
      ]);

      // 기본정보는 필수 — 실패하면 화면을 못 그리므로 에러로 처리
      if (detailRes.status !== 'fulfilled') {
        throw detailRes.reason;
      }
      const data = detailRes.value;

      // 운영데이터는 옵셔널 — 실패/미연동이면 폴백(하나 실패해도 나머지는 그려짐)
      const salesStats =
        statsRes.status === 'fulfilled' ? statsRes.value : null;
      const settleList =
        settleRes.status === 'fulfilled' ? (settleRes.value ?? []) : [];
      const account =
        accountRes.status === 'fulfilled' ? accountRes.value : null;
      const spaceList =
        spacesRes.status === 'fulfilled' ? (spacesRes.value ?? []) : [];
      const reservation =
        reservationRes.status === 'fulfilled' ? reservationRes.value : null;
      const review = reviewRes.status === 'fulfilled' ? reviewRes.value : null;

      // 미정산액 = 정산대기(WAITING) 건의 지급액(payoutAmt) 합
      const unsettledAmount = settleList
        .filter((s) => s.status === 'WAITING')
        .reduce((sum, s) => sum + (s.payoutAmt ?? 0), 0);

      // 백엔드 응답 → 화면 구조로 매핑
      setHost({
        // ─ 회원/호스트 기본정보 ─
        hostId: data.hostNo,
        name: data.memberName,
        email: data.memberEmail,
        phone: data.memberPhone,
        birthDate: data.memberBirthDate,
        businessName: data.businessName,
        businessNumber: data.businessNo,
        businessDocUrl: data.businessDocUrl,
        status: STATE_MAP[data.approvalState] ?? 'ACTIVE',
        approvedAt: data.approvedAt,
        createdAt: data.createdAt,
        rejectReason: data.rejectReason,

        stats: {
          // 보현(리뷰/예약) 실데이터
          averageRating: review?.averageRating ?? 0,
          reviewCount: review?.reviewCount ?? 0,
          ongoingReservationCount: reservation?.ongoingReservationCount ?? 0,
          completedReservationCount:
            reservation?.completedReservationCount ?? 0,
          // 서현진(공간) 실데이터
          spaceCount: spaceList.length,
          // 4번 도메인 실데이터
          totalRevenue: salesStats?.totalAmt ?? 0,
          unsettledAmount,
        },
        bankAccount: {
          bankName: account?.bankName ?? '-',
          accountNumber: maskAccountNo(account?.accountNo), // 마스킹 적용 (뒤 4자리만)
          accountHolder: account?.holder ?? '-',
          verified: !!account, // 계좌가 등록돼 있으면 인증된 것으로 표시
        },
        // 월별 매출 추이: trend[{yearMonth, totalAmt}] → 화면용 {month, revenue}
        monthlyRevenue: (salesStats?.trend ?? []).map((t) => ({
          month: t.yearMonth,
          revenue: t.totalAmt,
        })),
        // 서현진 공간 목록: [{placeNo, spaceName, spaceType}] → 화면용
        spaces: spaceList.map((s) => ({
          id: s.placeNo,
          name: s.spaceName,
          type: s.spaceType,
          reservationCount: s.reservationCount ?? 0, // 공간별 예약수
          basePrice: 0, // 기본가 — 서현진(가격 정의) 영역, 미연동
        })),
      });
    } catch (err) {
      setError(
        err.response?.data?.message ?? '호스트 정보를 불러오지 못했습니다.'
      );
    } finally {
      setLoading(false);
    }
  }, [hostId]);

  useEffect(() => {
    // set-state-in-effect 회피: 비동기 IIFE 로 감싸 setState 를 effect 동기 본문 밖으로
    (async () => {
      await fetchDetail();
    })();
  }, [fetchDetail]);

  // 자격 취소
  const revoke = async (reason) => {
    await revokeHost(hostId, reason);
    await fetchDetail(); // 갱신
  };

  // 자격 복구
  const restore = async () => {
    await restoreHost(hostId);
    await fetchDetail();
  };

  return { host, loading, error, revoke, restore };
};
