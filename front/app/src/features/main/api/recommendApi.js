import api from './../../../app/api/axiosApi';

export async function fetchRecommendPlaceList() {
  return api.get(`/place/recommend`);
}

export async function fetchTopPlaceList() {
  return api.get(`/place/topSpaces`);
}

export async function fetchRandomPlace() {
  return api.get(`/place/random`);
}
