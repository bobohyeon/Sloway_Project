import api from '../../../app/api/axiosApi';

// 정산 목록 (관리자) — 서버 페이지네이션 + 상태 필터
// pno(0-base) / tab(상태: all|WAITING|COMPLETE|INVOICE)
// 응답: { content: [...], totalPages, totalElements, number, ... } (Spring Page)
export async function findSettleAll(pno = 0, tab = 'all') {
  const resp = await api.get('/payment/settlement/settle', {
    params: { pno, tab },
  });
  return resp.data;
}

// 통계 카드용 — 목록과 별개로 전체 상태별 집계(대기/완료/발행 건수 + 총 정산액)
export async function findSettleStats() {
  const resp = await api.get('/payment/settlement/settle/stats');
  return resp.data;
}

// 정산 단건 상세
export async function findSettleByNo(no) {
  const resp = await api.get(`/payment/settlement/settle/${no}`);
  return resp.data;
}

// 호스트 본인 정산 목록 (최근순) — 토큰의 memberNo로 호스트 식별
export async function findSettleByHostNo() {
  const resp = await api.get(`/payment/settlement/settle/host`);
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
