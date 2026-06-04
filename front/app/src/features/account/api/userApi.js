import api from '../../../app/api/axiosApi';

/** 일반회원 마이페이지 조회. GET /api/user/mypage */
export const getMyPage = async () => {
  const response = await api.get('/user/mypage');
  return response.data;
};

/** 일반회원 마이페이지 수정. PATCH /api/user/mypage (name, phone, profileImage) */
export const updateMyPage = async (data, profileImage) => {
  const formData = new FormData();
  // dto는 JSON Blob으로 (백엔드 @RequestPart("dto")와 매칭)
  formData.append(
    'dto',
    new Blob([JSON.stringify(data)], { type: 'application/json' })
  );
  if (profileImage) {
    formData.append('profileImage', profileImage); // 파일 객체
  }

  const response = await api.patch('/user/mypage', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/** 이메일 변경. PATCH /api/user/mypage/email (인증 완료된 새 이메일) */
export const changeMyEmail = async (newEmail) => {
  const response = await api.patch('/user/mypage/email', { newEmail });
  return response.data;
};

/** 비밀번호 변경. PATCH /api/user/mypage/password */
export const changeMyPassword = async (currentPassword, newPassword) => {
  const response = await api.patch('/user/mypage/password', {
    currentPassword,
    newPassword,
  });
  return response.data;
};
export const getMySocialAccounts = async () => {
  const response = await api.get('/user/mypage/social-accounts'); // /user/social-accounts → /user/mypage/social-accounts
  return response.data;
};
