import api from '../../../app/api/axiosApi';

// 정산 계좌 등록/수정 (호스트당 1개 — 백엔드 upsert)
export async function registerAccount(reqDto) {
  const resp = await api.post('/payment/account', reqDto);
  return resp.data;
}

// 호스트 정산 계좌 조회 (미등록이면 null)
export async function findAccountByHostNo(hostNo) {
  const resp = await api.get(`/payment/account/host/${hostNo}`);
  return resp.data;
}
