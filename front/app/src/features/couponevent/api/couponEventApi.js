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

export async function downloadCoupon(no, memberNo) {
  const resp = await api.post(`/payment/coupon/event/${no}/download`, {
    memberNo,
  });
  return resp.data;
}
