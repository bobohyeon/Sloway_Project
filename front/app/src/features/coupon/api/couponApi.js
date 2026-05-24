import api from '../../../app/api/axiosApi';

export async function findCouponsByMemberNo(memberNo) {
  const resp = await api.get(`/payment/coupon/member/${memberNo}`);
  return resp.data;
}
