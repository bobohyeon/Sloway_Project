import api from '../../../app/api/axiosApi';

export async function readyPay(payReadyReqDto) {
  const resp = await api.post(`/payment/pay/ready`, payReadyReqDto);
  return resp.data;
}

export async function prepareTossPay(payReadyReqDto) {
  const resp = await api.post(`/payment/pay/toss/prepare`, payReadyReqDto);
  return resp.data;
}

export async function confirmTossPay({ paymentKey, orderId, amount }) {
  const resp = await api.post(`/payment/pay/toss/confirm`, {
    paymentKey,
    orderId,
    amount,
  });
  return resp.data;
}

export async function findPayAll() {
  const resp = await api.get(`/payment/pay`);
  return resp.data;
}

export async function findPayByNo(no) {
  const resp = await api.get(`/payment/pay/${no}`);
  return resp.data;
}

export async function findPaysByMemberNo(memberNo) {
  const resp = await api.get(`/payment/pay/member/${memberNo}`);
  return resp.data;
}
