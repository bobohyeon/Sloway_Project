import api from '../../../../../app/api/axiosApi';

export async function insertPlace(dto, files, sortList) {
  const fd = new FormData();
  fd.append(
    'dto',
    new Blob([JSON.stringify(dto)], { type: 'application/json' })
  );

  if (files && files.length > 0) {
    files.forEach((file) => {
      fd.append('files', file);
    });
  }

  if (sortList && sortList.length > 0) {
    fd.append(
      'sortList',
      new Blob([JSON.stringify(sortList)], { type: 'application/json' })
    );
  }
  return api.post(`/place/insert`, fd);
}

export async function fetchPlaceBrief(placeNo) {
  return await api.get(`/place/list/brief/${placeNo}`);
}

export async function fetchPlaceDetailList(placeNo) {
  return await api.get(`/place/list/detail/${placeNo}`);
}

export async function fetchPlaceListByHostNo() {
  return await api.get(`/place/list`);
}

export async function registerStationInspection(dto, files, sortList) {
  const fd = new FormData();
  fd.append(
    'dto',
    new Blob([JSON.stringify(dto)], { type: 'application/json' })
  );

  if (files && files.length > 0) {
    files.forEach((file) => {
      fd.append('files', file);
    });
  }

  if (sortList && sortList.length > 0) {
    fd.append(
      'sortList',
      new Blob([JSON.stringify(sortList)], { type: 'application/json' })
    );
  }
  return api.post(`/station/insert`, fd);
}

export async function registerOfficeInspection(dto, files, sortList) {
  const fd = new FormData();
  fd.append(
    'dto',
    new Blob([JSON.stringify(dto)], { type: 'application/json' })
  );

  if (files && files.length > 0) {
    files.forEach((file) => {
      fd.append('files', file);
    });
  }

  if (sortList && sortList.length > 0) {
    fd.append(
      'sortList',
      new Blob([JSON.stringify(sortList)], { type: 'application/json' })
    );
  }
  return api.post(`/office/insert`, fd);
}

export const registerWorkStayInspection = async (formData) => {
  const response = await api.post(`/workStay/insert`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};

export async function fetchPlaceDetail(no) {
  return await api.get(`/place/detail/update/${no}`);
}

export async function updatePlaceInfo(no, dto) {
  return await api.put(`/place/update/${no}`, dto);
}

export async function fetchMasterPlacesByType(type) {
  return await api.get(`/place/master`, {
    params: { type },
  });
}
