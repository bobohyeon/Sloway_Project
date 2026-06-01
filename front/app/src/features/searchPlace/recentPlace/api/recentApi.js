import api from '../../../../app/api/axiosApi';

export async function findRecentViewed() {
  const res = await api.get('/recent/viewed');
  return res.data;
}

export async function deleteRecentViewed(no) {
  await api.delete(`/recent/viewed/${no}`);
}

export async function deleteAllRecentViewed() {
  await api.delete('/recent/viewed');
}