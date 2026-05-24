import api from '../../../app/api/axiosApi';

export async function createRefund(refundCreateReqDto) {
  const resp = await api.post(`/payment/refund`, refundCreateReqDto);
  return resp.data;
}

export async function findRefundAll() {
  const resp = await api.get(`/payment/refund`);
  return resp.data;
}

export async function findRefundByNo(no) {
  const resp = await api.get(`/payment/refund/${no}`);
  return resp.data;
}

export async function findRefundsByMemberNo(memberNo) {
  const resp = await api.get(`/payment/refund/member/${memberNo}`);
  return resp.data;
}

export async function processRefund(no) {
  const resp = await api.patch(`/payment/refund/${no}/process`);
  return resp.data;
}
