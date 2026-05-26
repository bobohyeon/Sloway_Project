import api from '../../../app/api/axiosApi';

export async function createPay(payCreateReqDto) {
  const resp = await api.post(`/payment/pay`, payCreateReqDto);
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
