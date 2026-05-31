import api from './../../../../app/api/axiosApi';

export async function fetchApprovalDetail(type, id) {
  return await api.get(`/hostPlace/detail/${type}/${id}`);
}

export async function approvePlace(id) {
  return await api.put(`/hostPlace/approved/${id}`);
}

export async function rejectPlace(id, vo) {
  return await api.put(`/hostPlace/rejected/${id}`, vo);
}

export async function fetchApprovalList() {
  return await api.get(`/hostPlace`)
}