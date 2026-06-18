import api from '../../../app/api/axiosApi';

export async function createRefund(refundCreateReqDto) {
  const resp = await api.post(`/payment/refund`, refundCreateReqDto);
  return resp.data;
}

export async function findRefundAll(page = 0, tab = 'all', period = 'month') {
  // 서버 페이징 — page(0-base)/탭/기간을 쿼리로 전달, Page 객체(content/totalPages) 반환
  const resp = await api.get(`/payment/refund`, {
    params: { pno: page, tab, period },
  });
  return resp.data;
}

export async function findRefundStats() {
  const resp = await api.get(`/payment/refund/stats`);
  return resp.data;
}

export async function findMyRefunds(memberNo) {
  const resp = await api.get(`/payment/refund/member/${memberNo}`);
  return resp.data;
}

export async function findRefundByNo(no) {
  const resp = await api.get(`/payment/refund/${no}`);
  return resp.data;
}

// 결제 1건의 연관 환불 단건 — 환불 없으면 빈 바디('' 또는 null) 반환
export async function findRefundByPayNo(payNo) {
  const resp = await api.get(`/payment/refund/pay/${payNo}`);
  return resp.data;
}
