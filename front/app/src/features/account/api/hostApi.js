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

/** 호스트 마이페이지 수정. PATCH /api/host/mypage (dto + profileImage) */
export const updateHostMyPage = async (data, profileImage) => {
  const formData = new FormData();
  formData.append(
    'dto',
    new Blob([JSON.stringify(data)], { type: 'application/json' })
  );
  if (profileImage) {
    formData.append('profileImage', profileImage);
  }

  const response = await api.patch('/host/mypage', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/** 호스트 이메일 변경. PATCH /api/host/mypage/email */
export const changeHostEmail = async (newEmail) => {
  const response = await api.patch('/host/mypage/email', { newEmail });
  return response.data;
};

/** 호스트 본인 신청 현황. GET /api/host/mypage/application */
export const getMyHostApplication = async () => {
  const response = await api.get('/host/mypage/application');
  return response.data;
};
