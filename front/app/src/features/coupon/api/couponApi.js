import api from '../../../app/api/axiosApi';

export async function findCouponsByMemberNo(memberNo) {
  const resp = await api.get(`/payment/coupon/member/${memberNo}`);
  return resp.data;
}

// 백엔드 CouponCreateReqDto: couponName / dcType / dcValue / memberNo / expiredAt
export async function createCoupon(payload) {
  const resp = await api.post('/payment/coupon', payload);
  return resp.data;
}
