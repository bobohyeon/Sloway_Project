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
