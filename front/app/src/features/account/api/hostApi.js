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
/**
 * 호스트 재신청. POST /api/host/mypage/reapply
 * 반려된 호스트가 사업자정보·등록증을 보완해 다시 제출.
 * multipart: dto(JSON: businessName, businessNo) + businessDoc(파일)
 */
export const reapplyHost = async (data, businessDoc) => {
  const formData = new FormData();
  formData.append(
    'dto',
    new Blob([JSON.stringify(data)], { type: 'application/json' })
  );
  formData.append('businessDoc', businessDoc);

  const response = await api.post('/host/mypage/reapply', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/** 호스트 탈퇴 (soft delete). DELETE /api/host/mypage */
export const withdrawHost = async () => {
  await api.delete('/host/mypage');
};

/** 호스트 비밀번호 변경. PATCH /api/host/mypage/password */
export const changeHostPassword = async (currentPassword, newPassword) => {
  const response = await api.patch('/host/mypage/password', {
    currentPassword,
    newPassword,
  });
  return response.data;
};
