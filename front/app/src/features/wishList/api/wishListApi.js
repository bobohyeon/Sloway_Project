import api from '../../../app/api/axiosApi';

export async function addLikePlace(placeNo) {
  return await api.post(`/like/${placeNo}`);
}

export async function deleteLikePlace(likeNo) {
  return await api.delete(`/like/${likeNo}`);
}

export async function fetchLikePlaceList() {
  return await api.get(`like`);
}
