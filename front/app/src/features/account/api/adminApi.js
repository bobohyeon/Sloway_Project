import api from '../../../app/api/axiosApi';

/**
 * 어드민 회원 목록 조회. GET /api/admin/members
 * 전체를 큰 size로 한 번에 받아 클라이언트에서 필터링.
 */
export const getAdminMembers = async () => {
  const response = await api.get('/admin/members', {
    params: { page: 0, size: 1000 },
  });
  return response.data; // Spring Page 객체 { content, totalElements, ... }
};

/** 회원 정지. POST /api/admin/members/{id}/suspend */
export const suspendMember = async (memberId, reason, days) => {
  const response = await api.post(`/admin/members/${memberId}/suspend`, {
    reason,
    days, // 7, 30, 또는 null(영구)
  });
  return response.data;
};

/** 회원 정지 해제. POST /api/admin/members/{id}/unsuspend */
export const unsuspendMember = async (memberId) => {
  const response = await api.post(`/admin/members/${memberId}/unsuspend`);
  return response.data;
};

/** 어드민 회원 상세. GET /api/admin/members/{id} */
export const getAdminMemberDetail = async (memberId) => {
  const response = await api.get(`/admin/members/${memberId}`);
  return response.data;
};

/**
 * 어드민 호스트 목록. GET /api/admin/hosts
 * 전체를 받아 클라이언트에서 상태별 필터.
 */
export const getAdminHosts = async () => {
  const response = await api.get('/admin/hosts', {
    params: { page: 0, size: 1000 },
  });
  return response.data; // Page<HostListResponseDto>
};
/** 호스트 신청 상세. GET /api/admin/hosts/{id} */
export const getAdminHostDetail = async (hostId) => {
  const response = await api.get(`/admin/hosts/${hostId}`);
  return response.data;
};

/** 호스트 승인. POST /api/admin/hosts/{id}/approve */
export const approveHost = async (hostId) => {
  const response = await api.post(`/admin/hosts/${hostId}/approve`);
  return response.data;
};

/** 호스트 반려. POST /api/admin/hosts/{id}/reject (body: reason) */
export const rejectHost = async (hostId, reason) => {
  const response = await api.post(`/admin/hosts/${hostId}/reject`, { reason });
  return response.data;
};

/** 호스트 자격 박탈. POST /api/admin/hosts/{id}/revoke (body: reason) */
export const revokeHost = async (hostId, reason) => {
  const response = await api.post(`/admin/hosts/${hostId}/revoke`, { reason });
  return response.data;
};

/** 호스트 자격 복구. POST /api/admin/hosts/{id}/restore */
export const restoreHost = async (hostId) => {
  const response = await api.post(`/admin/hosts/${hostId}/restore`);
  return response.data;
};

// ── 어드민 — 호스트 상세의 4번 도메인(정산/계좌/매출) 운영데이터 ──
// 백엔드는 이미 구현돼 있음(SettleApiController/AccountApiController/StatsApiController 의 /admin/host/{hostNo}).

/**
 * 어드민 — 호스트 매출/월별 추이. GET /api/payment/stats/admin/host/{hostId}
 * 응답(HostSalesStatsResDto): { totalAmt, payCount, refundAmt, avgAmt, trend:[{yearMonth, totalAmt}] }
 */
export const getAdminHostStats = async (hostId, year, month, months = 12) => {
  const response = await api.get(`/payment/stats/admin/host/${hostId}`, {
    params: { year, month, months },
  });
  return response.data;
};

/**
 * 어드민 — 호스트 정산 목록(미정산 집계용). GET /api/payment/settlement/settle/admin/host/{hostId}
 * 응답(List<SettleResDto>): status==='WAITING' 건의 payoutAmt 합 = 미정산액.
 */
export const getAdminHostSettleList = async (hostId) => {
  const response = await api.get(
    `/payment/settlement/settle/admin/host/${hostId}`
  );
  return response.data;
};

/**
 * 어드민 — 호스트 계좌. GET /api/payment/account/admin/host/{hostId}
 * 응답(AccountResDto): { bankName, accountNo, holder } (계좌 미등록이면 null)
 */
export const getAdminHostAccount = async (hostId) => {
  const response = await api.get(`/payment/account/admin/host/${hostId}`);
  return response.data;
};
