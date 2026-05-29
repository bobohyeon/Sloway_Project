import api from '../../../app/api/axiosApi';

/**
 * 호스트 본인 마이페이지 조회.
 * GET /api/host/mypage — 토큰의 memberNo로 회원+사업자 정보 반환.
 * (businessName, name, approvalState, approvedAt 등 포함)
 */
export const getHostMyPage = async () => {
  const response = await api.get('/host/mypage');
  return response.data;
};
