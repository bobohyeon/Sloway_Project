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

// 서버 페이지네이션 + 필터 — pno(0-base), tab(상태), period(기간)을 쿼리로 전달
// 응답: { content: [...], totalPages, totalElements, number, ... } (Spring Page)
export async function findPayAll(pno = 0, tab = 'all', period = 'month') {
  const resp = await api.get(`/payment/pay`, { params: { pno, tab, period } });
  return resp.data;
}

// 통계 카드용 — 목록과 별개로 기간 내 전체 집계
export async function findPayStats(period = 'month') {
  const resp = await api.get(`/payment/pay/stats`, { params: { period } });
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

// 예약→환불 바로가기용: 내 결제 목록에서 해당 예약의 '완료된' 결제를 찾아 반환
// (백엔드에 rsvnNo 단건 조회 API가 없어 회원 결제 목록을 재활용 — 시연 규모에선 충분)
export async function findCompletedPayByRsvnNo(memberNo, rsvnNo) {
  const list = await findPaysByMemberNo(memberNo);
  return (
    list.find((p) => p.rsvnNo === Number(rsvnNo) && p.status === 'COMPLETED') ??
    null
  );
}
