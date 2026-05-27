import api from '../../../app/api/axiosApi';

function authHeader() {
  const token = localStorage.getItem('accessToken');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  } else {
    return {};
  }
}

export async function findReviewsByHost(placeNo, minScore, period) {
  const resp = await api.get(`/host/reply/reviews`, {
    headers: authHeader(),
    params: { placeNo, minScore, period },
  });
  return resp.data;
}

export async function deleteReply(replyNo) {
  const resp = await api.delete(`/review/reply/${replyNo}`, {
    headers: authHeader(),
  });
  return resp.data;
}
