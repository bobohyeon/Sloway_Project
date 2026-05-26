import api from '../../../../../app/api/axiosApi';

export async function getStationUpdateDetail(id) {
  return await api.get(`/station/update/${id}`);
}

export async function StationDetailUpdate(id, vo) {
  return await api.put(`/station/update/${id}`, vo);
}
