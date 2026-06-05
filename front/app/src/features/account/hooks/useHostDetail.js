import { useState, useEffect, useCallback } from 'react';
import { getAdminHostDetail, revokeHost, restoreHost } from '../api/adminApi';

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
 * 운영데이터(공간/예약/정산/리뷰)는 타 도메인 소관이라 미연동 → 더미로 채움.
 * (각 도메인 어드민 조회 API 준비되면 그 부분만 교체)
 */
export const useHostDetail = (hostId) => {
  const [host, setHost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetail = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAdminHostDetail(hostId);

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
        stats: {
          averageRating: 0,
          reviewCount: 0,
          spaceCount: 0,
          ongoingReservationCount: 0,
          completedReservationCount: 0,
          totalRevenue: 0,
          unsettledAmount: 0,
        },
        bankAccount: {
          bankName: '-',
          accountNumber: '-',
          accountHolder: '-',
          verified: false,
        },
        monthlyRevenue: [],
        spaces: [],
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
