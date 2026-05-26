import api from '../../../../../app/api/axiosApi';

// 1. 일반 공간 (Space)
export async function fetchSpaceImages(no) {
  const response = await api.get(`/place/update/image/${no}`);
  return response;
}

export async function updateSpaceImages(no, formData) {
  const response = await api.put(`/place/update/image/${no}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
}

// 2. 숙소 (Lodging)
export async function fetchLodgingImages(no) {
  const response = await api.get(`/station/update/image/${no}`);
  return response;
}

export async function updateLodgingImages(no, formData) {
  const response = await api.put(`/station/update/image/${no}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
}

// 3. 코워킹 오피스 (Coworking)
export async function fetchCoworkingImages(no) {
  const response = await api.get(`/office/update/image/${no}`);
  return response;
}

export async function updateCoworkingImages(no, formData) {
  const response = await api.put(`/office/update/image/${no}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
}

// 4. 워크스테이 패키지 (WorkStay)
export async function fetchWorkStayImages(no) {
  const response = await api.get(`/workStay/update/image/${no}`);
  return response;
}

export async function updateWorkStayImages(no, formData) {
  const response = await api.put(`/workStay/update/image/${no}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
}
