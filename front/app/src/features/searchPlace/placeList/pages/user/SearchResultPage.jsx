import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import SpaceCard from '../../components/user/SpaceCard';
import MainHeader from '../../../../main/layouts/MainHeader';
import { COLOR } from '../../../../rsvn/components/user/RsvnStyled';

const ALL_SPACES = [
  {
    id: 1,
    type: '워크앤스테이',
    title: '청평 숲속 파인뷰 스테이',
    location: '경기 가평',
    region: '경기',
    score: 4.9,
    reviewCount: 127,
    price: 185000,
    priceUnit: '원/박',
    amenities: ['모니터', '회의실', '와이파이'],
    roomLeft: 3,
    soldOut: false,
    icon: '🌲',
  },
  {
    id: 2,
    type: '오피스',
    title: '강릉 바다향 커먼워크',
    location: '강원 강릉',
    region: '강원',
    score: 4.8,
    reviewCount: 203,
    price: 28000,
    priceUnit: '원/4h',
    amenities: ['프린터', '폰부스', 'webcam'],
    roomLeft: 0,
    soldOut: false,
    icon: '🌊',
  },
  {
    id: 3,
    type: '숙소',
    title: '제주 돌담집 리트릿',
    location: '제주 서귀포',
    region: '제주',
    score: 4.9,
    reviewCount: 89,
    price: 220000,
    priceUnit: '원/박',
    amenities: ['주방', '어메니티', '세탁기'],
    roomLeft: 1,
    soldOut: false,
    icon: '🌴',
  },
  {
    id: 4,
    type: '워크앤스테이',
    title: '남해 올리브 팜스테이',
    location: '경남 남해',
    region: '경상',
    score: 4.92,
    reviewCount: 156,
    price: 165000,
    priceUnit: '원/박',
    amenities: ['모니터', '공용라운지', '와이파이'],
    roomLeft: 2,
    soldOut: false,
    icon: '✉️',
  },
  {
    id: 5,
    type: '오피스',
    title: '성수 브릭라운지',
    location: '서울 성수',
    region: '서울',
    score: 4.88,
    reviewCount: 312,
    price: 25000,
    priceUnit: '원/4h',
    amenities: ['PC', '빔프로젝터', '주차'],
    roomLeft: 0,
    soldOut: false,
    icon: '🧱',
  },
  {
    id: 6,
    type: '숙소',
    title: '양양 파도소리 빌라',
    location: '강원 양양',
    region: '강원',
    score: 4.95,
    reviewCount: 94,
    price: 240000,
    priceUnit: '원/박',
    amenities: ['주방', '세탁기', '스타일러'],
    roomLeft: 0,
    soldOut: true,
    icon: '🌅',
  },
  {
    id: 7,
    type: '워크앤스테이',
    title: '속초 설악 글램스테이',
    location: '강원 속초',
    region: '강원',
    score: 4.87,
    reviewCount: 78,
    price: 210000,
    priceUnit: '원/박',
    amenities: ['모니터', '와이파이', '주방'],
    roomLeft: 1,
    soldOut: false,
    icon: '⛰️',
  },
  {
    id: 8,
    type: '숙소',
    title: '전주 한옥 스테이',
    location: '전북 전주',
    region: '전라',
    score: 4.82,
    reviewCount: 62,
    price: 180000,
    priceUnit: '원/박',
    amenities: ['주방', '어메니티'],
    roomLeft: 2,
    soldOut: false,
    icon: '🏯',
  },
];

const TYPE_TABS = ['전체', '워크앤스테이', '오피스', '숙소'];
const REGIONS = [
  '전체',
  '서울',
  '경기',
  '전라',
  '경상',
  '충청',
  '제주',
  '강원',
];
const PRICE_RANGES = [
  { label: '전체', min: 0, max: Infinity },
  { label: '5만원 이하', min: 0, max: 50000 },
  { label: '5~15만원', min: 50000, max: 150000 },
  { label: '15~25만원', min: 150000, max: 250000 },
  { label: '25만원 이상', min: 250000, max: Infinity },
];
const AMENITY_OPTIONS = {
  공통: ['회의실', '와이파이', '공용PC', '반려동물 동반', '공용라운지'],
  숙박: ['주방', '편의용품', '세탁기', '스타일러'],
  오피스: ['주차', '프린터', '웹캠', '빔프로젝터'],
};

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: ${COLOR.cream};
  font-family: 'Noto Sans KR', sans-serif;
`;

const Body = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const SideFilter = styled.aside`
  width: 240px;
  flex-shrink: 0;
  padding: 24px 20px;
  border-right: 1px solid ${COLOR.gray200};
  background: #fff;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: #d8d3cb;
    border-radius: 10px;
  }
`;

const FilterSection = styled.div`
  margin-bottom: 22px;
`;

const FilterTitle = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: ${COLOR.gray400};
  letter-spacing: 0.06em;
  margin-bottom: 10px;
`;

const RadioRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: ${({ $active }) => ($active ? COLOR.green : COLOR.gray600)};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  margin-bottom: 7px;
  cursor: pointer;
  input {
    accent-color: ${COLOR.green};
  }
`;

const CheckRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: ${COLOR.gray600};
  margin-bottom: 7px;
  cursor: pointer;
  input {
    accent-color: ${COLOR.green};
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${COLOR.gray200};
  margin: 14px 0;
`;

const GuestInput = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const GuestBtn = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid ${COLOR.gray200};
  background: #fff;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    border-color: ${COLOR.sage};
  }
`;

const ResetBtn = styled.button`
  width: 100%;
  padding: 9px;
  border-radius: 8px;
  border: 1px solid ${COLOR.gray200};
  background: #fff;
  font-size: 12px;
  color: ${COLOR.gray600};
  cursor: pointer;
  margin-top: 4px;
  &:hover {
    border-color: ${COLOR.sage};
    color: ${COLOR.green};
  }
`;

const Main = styled.main`
  flex: 1;
  padding: 24px 32px;
  overflow-y: auto;
  min-width: 0;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: #d8d3cb;
    border-radius: 10px;
  }
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 10px;
`;

const BackBtn = styled.button`
  font-size: 13px;
  color: ${COLOR.gray400};
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  &:hover {
    color: ${COLOR.black};
  }
`;

const SearchChips = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
`;

const Chip = styled.div`
  padding: 7px 14px;
  border-radius: 20px;
  border: 1px solid ${COLOR.gray200};
  background: #fff;
  font-size: 13px;
  font-weight: 500;
`;

const TypeTabs = styled.div`
  display: flex;
  border-bottom: 1px solid ${COLOR.gray200};
  margin-bottom: 16px;
`;

const TypeTab = styled.button`
  padding: 10px 16px;
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
  color: ${({ $active }) => ($active ? COLOR.black : '#AAAAAA')};
  background: none;
  border: none;
  border-bottom: 2.5px solid
    ${({ $active }) => ($active ? COLOR.green : 'transparent')};
  margin-bottom: -1px;
  cursor: pointer;
`;

const SortRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ResultCount = styled.span`
  font-size: 13px;
  color: ${COLOR.gray400};
`;

const SortSelect = styled.select`
  padding: 7px 12px;
  border: 1px solid ${COLOR.gray200};
  border-radius: 8px;
  font-size: 13px;
  background: #fff;
  outline: none;
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 6px;
`;

const ViewBtn = styled.button`
  padding: 7px 14px;
  border-radius: 8px;
  border: 1px solid ${({ $active }) => ($active ? COLOR.green : COLOR.gray200)};
  background: ${({ $active }) => ($active ? COLOR.greenLight : '#fff')};
  color: ${({ $active }) => ($active ? COLOR.green : '#555')};
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  cursor: pointer;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const EmptyBox = styled.div`
  text-align: center;
  padding: 60px 0;
  color: ${COLOR.gray400};
  font-size: 14px;
  grid-column: 1 / -1;
`;

function SearchResultPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const initType = state?.type || '전체';
  const initRegion = state?.region || '전체';
  const initGuests = state?.guests || 2;

  const [activeTab, setActiveTab] = useState(
    TYPE_TABS.indexOf(initType) >= 0 ? TYPE_TABS.indexOf(initType) : 0
  );
  const [region, setRegion] = useState(initRegion);
  const [guests, setGuests] = useState(initGuests);
  const [priceIdx, setPriceIdx] = useState(0);
  const [amenities, setAmenities] = useState([]);
  const [sort, setSort] = useState('인기순');

  // 페이지 이동할 때 state 반영
  useEffect(() => {
    if (state?.type) {
      const idx = TYPE_TABS.indexOf(state.type);
      if (idx >= 0) setActiveTab(idx);
    }
    if (state?.region) setRegion(state.region);
    if (state?.guests) setGuests(state.guests);
  }, [state]);

  const toggleAmenity = (a) =>
    setAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );

  const reset = () => {
    setActiveTab(0);
    setRegion('전체');
    setGuests(2);
    setPriceIdx(0);
    setAmenities([]);
  };

  const filtered = useMemo(() => {
    let list = [...ALL_SPACES];
    if (activeTab > 0)
      list = list.filter((s) => s.type === TYPE_TABS[activeTab]);
    if (region !== '전체') list = list.filter((s) => s.region === region);
    const { min, max } = PRICE_RANGES[priceIdx];
    list = list.filter((s) => s.price >= min && s.price <= max);
    if (amenities.length > 0)
      list = list.filter((s) =>
        amenities.every((a) => s.amenities.includes(a))
      );
    if (sort === '가격 낮은순') list.sort((a, b) => a.price - b.price);
    else if (sort === '가격 높은순') list.sort((a, b) => b.price - a.price);
    else if (sort === '평점순') list.sort((a, b) => b.score - a.score);
    return list;
  }, [activeTab, region, guests, priceIdx, amenities, sort]);

  // 카드 클릭 → 방 리스트 페이지
  const handleCardClick = (item) => {
    navigate(`/spaces/${item.id}/rooms`, { state: { space: item } });
  };

  return (
    <Layout>
      <MainHeader activePage="search" />

      <Body>
        {/* 사이드 필터 */}
        <SideFilter>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: COLOR.black,
              marginBottom: 20,
            }}
          >
            필터
          </div>

          <FilterSection>
            <FilterTitle>지역</FilterTitle>
            {REGIONS.map((r) => (
              <RadioRow key={r} $active={region === r}>
                <input
                  type="radio"
                  name="region"
                  checked={region === r}
                  onChange={() => setRegion(r)}
                />
                {r}
              </RadioRow>
            ))}
          </FilterSection>

          <Divider />

          <FilterSection>
            <FilterTitle>인원수</FilterTitle>
            <GuestInput>
              <GuestBtn onClick={() => setGuests((g) => Math.max(1, g - 1))}>
                −
              </GuestBtn>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  minWidth: 20,
                  textAlign: 'center',
                }}
              >
                {guests}명
              </span>
              <GuestBtn onClick={() => setGuests((g) => g + 1)}>+</GuestBtn>
            </GuestInput>
          </FilterSection>

          <Divider />

          <FilterSection>
            <FilterTitle>가격대</FilterTitle>
            {PRICE_RANGES.map((p, i) => (
              <RadioRow key={i} $active={priceIdx === i}>
                <input
                  type="radio"
                  name="price"
                  checked={priceIdx === i}
                  onChange={() => setPriceIdx(i)}
                />
                {p.label}
              </RadioRow>
            ))}
          </FilterSection>

          <Divider />

          {/* 편의시설 */}
          {Object.entries(AMENITY_OPTIONS).map(([category, items]) => (
            <FilterSection key={category}>
              <FilterTitle>{category} 편의시설</FilterTitle>
              {items.map((a) => (
                <CheckRow key={a}>
                  <input
                    type="checkbox"
                    checked={amenities.includes(a)}
                    onChange={() => toggleAmenity(a)}
                  />
                  {a}
                </CheckRow>
              ))}
            </FilterSection>
          ))}

          <ResetBtn onClick={reset}>필터 초기화</ResetBtn>
        </SideFilter>

        {/* 메인 */}
        <Main>
          <TopRow>
            <BackBtn onClick={() => navigate(-1)}>← 이전으로</BackBtn>
            <ViewToggle>
              <ViewBtn $active>🗂 리스트</ViewBtn>
              <ViewBtn onClick={() => navigate('/spaces/search/map')}>
                🗺 지도
              </ViewBtn>
            </ViewToggle>
          </TopRow>

          <SearchChips>
            <Chip>📍 {region === '전체' ? '전체 지역' : region}</Chip>
            <Chip>📅 5월 8일 ~ 5월 10일</Chip>
            <Chip>👤 {guests}명</Chip>
          </SearchChips>

          <div style={{ marginBottom: 4 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: COLOR.gray400,
                letterSpacing: '.1em',
              }}
            >
              SEARCH RESULTS
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 8,
              marginBottom: 4,
            }}
          >
            <span style={{ fontSize: 26, fontWeight: 700 }}>검색 결과</span>
            <span style={{ fontSize: 15, color: COLOR.sage, fontWeight: 600 }}>
              {filtered.length}개
            </span>
          </div>
          <div style={{ fontSize: 13, color: COLOR.gray400, marginBottom: 20 }}>
            필터와 정렬로 원하는 공간을 찾아보세요
          </div>

          <TypeTabs>
            {TYPE_TABS.map((tab, idx) => (
              <TypeTab
                key={idx}
                $active={activeTab === idx}
                onClick={() => setActiveTab(idx)}
              >
                {tab}
              </TypeTab>
            ))}
          </TypeTabs>

          <SortRow>
            <ResultCount>총 {filtered.length}개</ResultCount>
            <SortSelect value={sort} onChange={(e) => setSort(e.target.value)}>
              <option>인기순</option>
              <option>가격 낮은순</option>
              <option>가격 높은순</option>
              <option>평점순</option>
            </SortSelect>
          </SortRow>

          <Grid>
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <SpaceCard
                  key={item.id}
                  item={item}
                  onClick={handleCardClick}
                />
              ))
            ) : (
              <EmptyBox>
                🔍 조건에 맞는 공간이 없어요
                <br />
                <span style={{ fontSize: 12, display: 'block', marginTop: 6 }}>
                  필터를 조정해보세요
                </span>
              </EmptyBox>
            )}
          </Grid>
        </Main>
      </Body>
    </Layout>
  );
}

export default SearchResultPage;
