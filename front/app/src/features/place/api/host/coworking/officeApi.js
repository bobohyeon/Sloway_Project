import api from '../../../../../app/api/axiosApi';

export async function getOfficeDetail(id) {
  return await api.get(`/office/update/${id}`);
}

export async function updateOfficeApi(id, vo) {
  return await api.put(`/office/update/${id}`, vo);
}
