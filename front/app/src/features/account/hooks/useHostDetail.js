import { useState, useEffect, useCallback } from 'react';
import {
  getAdminHostDetail,
  revokeHost,
  restoreHost,
  // ── A안 운영데이터: 각 도메인 어드민 엔드포인트 회신되면 주석 해제 ──
  // getAdminHostReservationStats, // 보현 — 예약 건수
  // getAdminHostReviewStats,      // 보현 — 평점/리뷰수
  // getAdminHostSpaces,           // 공간 담당 — 공간 목록/개수
  // getAdminHostSettlement,       // 정산 담당 — 매출/미정산/월별
  // getAdminHostAccount,          // 정산 담당 — 계좌(verified)
} from '../api/adminApi';

// 백엔드 approvalState(P/A/R/V) → 화면 상태값 매핑 (useHostList와 동일)
const STATE_MAP = {
  P: 'PENDING',
  A: 'ACTIVE',
  R: 'REJECTED',
  V: 'REVOKED',
};

/**
 * 어드민 — 호스트 상세 조회 훅.
 *
 * 백엔드(GET /api/admin/hosts/{id})가 주는 필드: 사업자정보·회원정보·승인상태.
 * 운영데이터(공간/예약/정산/리뷰)는 타 도메인 소관 → A안(각 도메인 어드민 엔드포인트)으로 받음.
 * 아직 미회신이라 지금은 더미로 채움. 엔드포인트 회신되면 주석 처리된 병렬 호출만 풀면 됨.
 * (하나 실패/미연동이어도 나머지는 그려지게 Promise.allSettled 사용)
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
      // 엔드포인트 회신되면 아래 주석 줄 해제 (배열 순서 = 구조분해 순서 유지)
      const [
        detailRes,
        // reservationRes,
        // reviewRes,
        // spacesRes,
        // settlementRes,
        // accountRes,
      ] = await Promise.allSettled([
        getAdminHostDetail(hostId),
        // getAdminHostReservationStats(hostId),
        // getAdminHostReviewStats(hostId),
        // getAdminHostSpaces(hostId),
        // getAdminHostSettlement(hostId),
        // getAdminHostAccount(hostId),
      ]);

      // 기본정보는 필수 — 실패하면 화면을 못 그리므로 에러로 처리
      if (detailRes.status !== 'fulfilled') {
        throw detailRes.reason;
      }
      const data = detailRes.value;

      // 운영데이터는 옵셔널 — 실패/미연동이면 빈 객체로 폴백(더미 유지)
      // const reservation = reservationRes.status === 'fulfilled' ? reservationRes.value : {};
      // const review      = reviewRes.status      === 'fulfilled' ? reviewRes.value      : {};
      // const spaceData   = spacesRes.status      === 'fulfilled' ? spacesRes.value      : {};
      // const settlement  = settlementRes.status  === 'fulfilled' ? settlementRes.value  : {};
      // const account     = accountRes.status     === 'fulfilled' ? accountRes.value     : {};

      // 백엔드 응답 → 화면 구조로 매핑
      setHost({
        // ─ 네 도메인 (실데이터) ─
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

        // ─ 타 도메인 (미연동, 더미) — JSX 구조에 맞춤 ─
        // 엔드포인트 회신되면 0/'-' 대신 우측 주석의 응답값으로 교체
        stats: {
          averageRating: 0, // ← review.averageRating
          reviewCount: 0, // ← review.reviewCount
          spaceCount: 0, // ← spaceData.spaceCount
          ongoingReservationCount: 0, // ← reservation.ongoingReservationCount
          completedReservationCount: 0, // ← reservation.completedReservationCount
          totalRevenue: 0, // ← settlement.totalRevenue
          unsettledAmount: 0, // ← settlement.unsettledAmount
        },
        bankAccount: {
          bankName: '-', // ← account.bankName
          accountNumber: '-', // 계좌번호 미수신(민감정보) — '-' 고정
          accountHolder: '-', // 예금주 미수신(민감정보) — '-' 고정
          verified: false, // ← account.verified
        },
        monthlyRevenue: [], // ← settlement.monthlyRevenue
        spaces: [], // ← spaceData.spaces
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
    fetchDetail();
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
