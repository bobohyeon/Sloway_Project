import api from '../../../app/api/axiosApi';

export async function findBlackouts(entityNo) {
  const res = await api.get(`/host/blackout?entityNo=${entityNo}`);
  return res.data;
}

export async function saveBlackout(entityNo, dto) {
  await api.post(`/host/blackout?entityNo=${entityNo}`, dto);
}

export async function editBlackout(no, dto) {
  await api.put(`/host/blackout/${no}`, dto);
}

export async function deleteBlackout(no) {
  await api.delete(`/host/blackout/${no}`);
}

// 호스트 달력용 — 내 모든 공간 블랙아웃 조회
export async function findHostBlackouts() {
  const res = await api.get('/host/blackout/host');
  return res.data;
}
