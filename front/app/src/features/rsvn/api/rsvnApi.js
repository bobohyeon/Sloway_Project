import api from '../../../app/api/axiosApi';

export async function findMyRsvns() {
  const res = await api.get('/reservation');
  return res.data;
}

export async function findOneRsvn(id) {
  const res = await api.get(`/reservation/${id}`);
  return res.data;
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
