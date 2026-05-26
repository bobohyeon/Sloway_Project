import api from '../../../../../app/api/axiosApi';

export async function getWorkStayUpdateDetail(id) {
  return await api.get(`/workStay/update/${id}`);
}

export async function workStayDetailUpdate(id, vo) {
  return await api.put(`/workStay/update/${id}`, vo);
}
