import api from '../../../app/api/axiosApi';
export async function findPointBalanceByMemberNo(memberNo) {
  const resp = await api.get(`/payment/point/member/${memberNo}/balance`);
  return resp.data;
}
