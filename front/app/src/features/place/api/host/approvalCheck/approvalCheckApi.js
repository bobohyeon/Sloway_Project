import api from '../../../../../app/api/axiosApi';

export async function checkApproval(type, no) {
  return await api.get(`/hostPlace/check/${type}/${no}`);
}
