import api from '../../../app/api/axiosApi';

/** 일반회원 마이페이지 조회. GET /api/user/mypage */
export const getMyPage = async () => {
  const response = await api.get('/user/mypage');
  return response.data;
};

/** 일반회원 마이페이지 수정. PATCH /api/user/mypage (name, phone, imgUrl) */
export const updateMyPage = async (data) => {
  const response = await api.patch('/user/mypage', data);
  return response.data;
};

/** 이메일 변경. PATCH /api/user/mypage/email (인증 완료된 새 이메일) */
export const changeMyEmail = async (newEmail) => {
  const response = await api.patch('/user/mypage/email', { newEmail });
  return response.data;
};
