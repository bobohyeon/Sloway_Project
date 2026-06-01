import api from '../../../app/api/axiosApi';

// 정산 목록 (관리자 — 전체 정산 회차)
export async function findSettleAll() {
  const resp = await api.get('/payment/settlement/settle');
  return resp.data;
}

// 정산 단건 상세
export async function findSettleByNo(no) {
  const resp = await api.get(`/payment/settlement/settle/${no}`);
  return resp.data;
}

// 호스트별 정산 목록 (최근순) — 호스트 정산 화면용
export async function findSettleByHostNo(hostNo) {
  const resp = await api.get(`/payment/settlement/settle/host/${hostNo}`);
  return resp.data;
}

// 정산 수동 생성 (hostNo + 기간) — 매출 0이면 백엔드가 null 반환(스킵)
export async function createSettle(reqDto) {
  const resp = await api.post('/payment/settlement/settle', reqDto);
  return resp.data;
}

// 정산 확정 (WAITING → COMPLETE)
export async function completeSettle(no) {
  const resp = await api.patch(`/payment/settlement/settle/${no}/complete`);
  return resp.data;
}

// 세금계산서 발행 (COMPLETE → INVOICE)
export async function issueTaxInvoice(no) {
  const resp = await api.patch(`/payment/settlement/settle/${no}/invoice`);
  return resp.data;
}
