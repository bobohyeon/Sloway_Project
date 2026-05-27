import api from '../../../../../app/api/axiosApi';

export async function fetchTypeAmenityListApi(type) {
  return await api.get(`/amenity/list/${type}`);
}
