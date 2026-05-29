import api from '../../../app/api/axiosApi';

export async function findBlackouts(placeNo) {
  const res = await api.get(`/blackout?placeNo=${placeNo}`);
  return res.data;
}

export async function saveBlackout(placeNo, dto) {
  await api.post(`/blackout?placeNo=${placeNo}`, dto);
}

export async function editBlackout(no, dto) {
  await api.put(`/blackout/${no}`, dto);
}

export async function deleteBlackout(no) {
  await api.delete(`/blackout/${no}`);
}
