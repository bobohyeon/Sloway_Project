import api from '../../../app/api/axiosApi';

export async function createEvent(payload) {
  const resp = await api.post('/payment/coupon/event', payload);
  return resp.data;
}

export async function findEventAll() {
  const resp = await api.get('/payment/coupon/event');
  return resp.data;
}

export async function closeEvent(no) {
  const resp = await api.patch(`/payment/coupon/event/${no}/close`);
  return resp.data;
}

export async function downloadCoupon(no) {
  // 발급 대상은 백엔드가 인증 토큰(principal)에서 본인 memberNo로 결정 — body 불필요
  const resp = await api.post(`/payment/coupon/event/${no}/download`);
  return resp.data;
}
