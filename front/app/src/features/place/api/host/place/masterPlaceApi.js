import api from '../../../../../app/api/axiosApi';

const API_PATH_MAP = {
  lodging: 'station',
  coworking: 'office',
  workStay: 'workStay',
  space: 'place',
};

export const fetchStationDetailDashboard = async (typePath, id) => {
  const backendType = API_PATH_MAP[typePath] || typePath;
  const response = await api.get(`/${backendType}/detail/dash/${id}`);
  return response.data;
};

export async function fetchDetailImageList(typePath, id){
  const backendType = API_PATH_MAP[typePath] || typePath;
  const response = await api.get(`/${backendType}/image/list/${id}`);
  return response.data;
}