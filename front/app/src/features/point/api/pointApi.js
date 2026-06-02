import api from '../../../app/api/axiosApi';

export async function findPointBalanceByMemberNo(memberNo) {
  const resp = await api.get(`/payment/point/member/${memberNo}/balance`);
  return resp.data;
}

export async function findPointsByMemberNo(memberNo) {
  const resp = await api.get(`/payment/point/member/${memberNo}`);
  return resp.data;
}
