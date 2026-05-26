import api from '../../../../../app/api/axiosApi';

const API_PATH_MAP = {
  lodging: 'station',
  coworking: 'office',
  workStay: 'workStay',
};

export const fetchStationDetailDashboard = async (typePath, id) => {
  const backendType = API_PATH_MAP[typePath] || typePath;
  const response = await api.get(`/${backendType}/detail/dash/${id}`);
  return response.data;
};
