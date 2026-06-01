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
