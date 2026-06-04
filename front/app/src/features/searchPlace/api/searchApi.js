import api from '../../../app/api/axiosApi';

// 한국어 지역명 → RegionType enum 변환
const REGION_MAP = {
  서울: 'SEOUL',
  경기: 'GYEONGGI',
  전라: 'JEONRA',
  경상: 'GYEONGSANG',
  충청: 'CHUNGCHEONG',
  제주: 'JEJU',
  강원: 'GANGWON',
  인천: 'INCHEON',
};

// 한국어 정렬명 → SortType enum 변환
const SORT_MAP = {
  인기순: 'POPULAR',
  '가격 낮은순': 'PRICE_ASC',
  '가격 높은순': 'PRICE_DESC',
  평점순: 'SCORE',
};

export async function getOfficeDetail(no) {
  const res = await api.get(`/spaces/office/${no}`);
  return res.data;
}

export async function getStationDetail(no) {
  const res = await api.get(`/spaces/station/${no}`);
  return res.data;
}

export async function getWorkStayDetail(no) {
  const res = await api.get(`/spaces/workStay/${no}`);
  return res.data;
}

export async function searchSpaces({ region, placeType, sort, checkIn, checkOut, guestCount } = {}) {
  const params = {};
  if (region && region !== '전체') params.region = REGION_MAP[region];
  if (placeType && placeType !== '전체') params.placeType = placeType;
  if (sort) params.sort = SORT_MAP[sort] ?? 'POPULAR';
  // checkIn·checkOut은 반드시 둘 다 있을 때만 전송 (한쪽만 보내면 서버 NPE)
  if (checkIn && checkOut) {
    params.checkIn = checkIn;
    params.checkOut = checkOut;
  }
  if (guestCount) params.guestCount = guestCount;

  const res = await api.get('/spaces/search', { params });
  return res.data;
}
