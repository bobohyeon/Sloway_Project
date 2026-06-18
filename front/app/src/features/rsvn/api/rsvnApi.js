import api from '../../../app/api/axiosApi';

export async function findMyRsvns() {
  const res = await api.get('/reservation');
  return res.data;
}

export async function findOneRsvn(id) {
  const res = await api.get(`/reservation/${id}`);
  return res.data;
}

export async function findOneRsvnForHost(id) {
  const res = await api.get(`/reservation/host/${id}`);
  return res.data;
}

export async function findBlockedDates(entityNo, type) {
  const res = await api.get('/reservation/blocked-dates', { params: { entityNo, type } });
  return res.data; // [{ startDate, endDate }]
}

export async function cancelRsvn(id, refundReason) {
  const params = refundReason ? { refundReason } : {};
  await api.post(`/reservation/${id}/cancel`, null, { params });
}

export async function findHostRsvns() {
  const res = await api.get('/reservation/host');
  return res.data;
}

export async function findHostSpaces() {
  const res = await api.get('/reservation/host/spaces');
  return res.data;
}

export async function saveRsvn(dto) {
  const res = await api.post('/reservation', dto);
  return res.data;
}

export async function findReviewable() {
  const res = await api.get('/reservation/reviewable');
  return res.data;
}

export async function rejectRsvn(no, payNo) {
  const res = await api.post(`/reservation/${no}/reject`, null, {
    params: { payNo },
  });
  return res.data;
}

export async function forceCancelForAdmin(no) {
  await api.post(`/reservation/admin/${no}/force-cancel`);
}

export async function findRsvnStatsForAdmin() {
  const res = await api.get('/reservation/admin/stats');
  return res.data; // { TOTAL: N, P: N, S: N, E: N, R: N, C: N }
}

export async function findAllRsvnsForAdmin(page = 0, size = 20, status = null) {
  const params = { page, size };
  if (status) params.status = status; // 탭 선택 시 서버에 status 전달, 전체면 생략
  const res = await api.get('/reservation/admin', { params });
  return res.data;
}
