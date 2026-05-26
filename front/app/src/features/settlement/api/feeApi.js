import api from '../../../app/api/axiosApi';

export async function createFee(feeCreateReqDto) {
  const resp = await api.post(`/settlement/fee`, feeCreateReqDto);
  return resp.data;
}

export async function findFeeAll() {
  const resp = await api.get(`/settlement/fee`);
  return resp.data;
}

export async function findFeeById(no) {
  const resp = await api.get(`/settlement/fee/${no}`);
  return resp.data;
}
