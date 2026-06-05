import api from '../../../../app/api/axiosApi';

export async function saveRecentViewed(placeNo) {
  await api.post('/recent/viewed', null, { params: { placeNo } });
}

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