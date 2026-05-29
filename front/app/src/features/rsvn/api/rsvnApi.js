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
  await api.post(`/reservation/${id}/cancel?refundReason=${refundReason}`);
}
