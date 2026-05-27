import api from '../../../../app/api/axiosApi';

export async function fetchAmenityListApi() {
  return await api.get(`/amenity/list`);
}
export async function updateAmenityApi(no, vo) {
  return await api.put(`/amenity/update/${no}`, vo);
}
export async function deleteAmenityApi(no) {
  return await api.delete(`/amenity/delete/${no}`);
}
export async function addAmenityApi() {
  return await api.post(`/amenity/insert`);
}
