import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import SpaceCard from '../../components/user/SpaceCard';
import { COLOR } from '../../../../rsvn/components/user/RsvnStyled';

// ── 더미 데이터 ───────────────────────────────────────────
const ALL_SPACES = [
  {
    id: 1,
    type: '워크앤스테이',
    title: '청평 숲속 파인뷰 스테이',
    location: '경기 가평',
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
    type: '코워킹오피스',
    title: '강릉 바다향 커먼워크',
    location: '강원 강릉',
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
    type: '코워킹오피스',
    title: '성수 브릭라운지',
    location: '서울 성수',
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
    score: 4.87,
    reviewCount: 78,
    price: 210000,
    priceUnit: '원/박',
    amenities: ['모니터', '와이파이', '주방'],
    roomLeft: 1,
    soldOut: false,
    icon: '⛰️',
  },
];

const TYPE_TABS = ['전체', '워크앤스테이', '코워킹오피스', '숙소'];
const AMENITY_OPTIONS = {
  공통: ['회의실', '공용PC', '와이파이', '반려동물동반', '공용라운지'],
  숙박: ['주방', '어메니티', '세탁기', '스타일러'],
  오피스: ['webcam', '공용PC', '주차', '빔프로젝터', '프린터'],
};
const REGIONS = ['전체', '서울', '경기', '강원', '제주', '경남', '부산'];
const PRICE_RANGES = [
  { label: '전체', min: 0, max: Infinity },
  { label: '5만원 이하', min: 0, max: 50000 },
  { label: '5만~15만원', min: 50000, max: 150000 },
  { label: '15만~25만원', min: 150000, max: 250000 },
  { label: '25만원 이상', min: 250000, max: Infinity },
];

// ── 레이아웃 ──────────────────────────────────────────────
const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${COLOR.cream};
  font-family: 'Noto Sans KR', sans-serif;
`;

// ── 사이드 필터 ───────────────────────────────────────────
const SideFilter = styled.aside`
  width: 240px;
  flex-shrink: 0;
  padding: 28px 20px;
  border-right: 1px solid ${COLOR.gray200};
  background: #fff;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
`;

const FilterSection = styled.div`
  margin-bottom: 24px;
`;

const FilterTitle = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${COLOR.gray400};
  letter-spacing: 0.06em;
  margin-bottom: 10px;
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
  &:hover {
    color: ${COLOR.black};
  }
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

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${COLOR.gray200};
  margin: 16px 0;
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
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    border-color: ${COLOR.sage};
  }
`;

const GuestCount = styled.span`
  font-size: 14px;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
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

// ── 메인 콘텐츠 ───────────────────────────────────────────
const Main = styled.main`
  flex: 1;
  padding: 28px 32px;
  min-width: 0;
`;

const SearchBarRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const SearchChip = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 20px;
  border: 1px solid ${COLOR.gray200};
  background: #fff;
  font-size: 13px;
  font-weight: 500;
`;

const ChangeBtn = styled.button`
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid ${COLOR.green};
  background: ${COLOR.greenLight};
  color: ${COLOR.green};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
`;

const ResultHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 16px;
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
  justify-content: flex-end;
  margin-bottom: 16px;
`;

const SortSelect = styled.select`
  padding: 7px 12px;
  border: 1px solid ${COLOR.gray200};
  border-radius: 8px;
  font-size: 13px;
  background: #fff;
  outline: none;
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

  // 검색 조건 state
  const [region, setRegion] = useState('전체');
  const [guests, setGuests] = useState(2);
  const [priceIdx, setPriceIdx] = useState(0);
  const [amenities, setAmenities] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [sort, setSort] = useState('인기순');

  // 편의시설 토글
  const toggleAmenity = (a) => {
    setAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  };

  // 필터 초기화
  const resetFilter = () => {
    setRegion('전체');
    setGuests(2);
    setPriceIdx(0);
    setAmenities([]);
    setActiveTab(0);
  };

  // 필터링 로직
  const filtered = useMemo(() => {
    let list = [...ALL_SPACES];

    // 공간 유형 탭
    if (activeTab > 0) {
      list = list.filter((s) => s.type === TYPE_TABS[activeTab]);
    }

    // 지역
    if (region !== '전체') {
      list = list.filter((s) => s.location.includes(region));
    }

    // 가격대
    const { min, max } = PRICE_RANGES[priceIdx];
    list = list.filter((s) => s.price >= min && s.price <= max);

    // 편의시설 (선택한 것 모두 포함하는 공간만)
    if (amenities.length > 0) {
      list = list.filter((s) =>
        amenities.every((a) => s.amenities.includes(a))
      );
    }

    // 정렬
    if (sort === '가격 낮은순') list.sort((a, b) => a.price - b.price);
    else if (sort === '가격 높은순') list.sort((a, b) => b.price - a.price);
    else if (sort === '평점순') list.sort((a, b) => b.score - a.score);

    return list;
  }, [activeTab, region, priceIdx, amenities, sort]);

  return (
    <Layout>
      {/* ── 사이드 필터 ── */}
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

        {/* 지역 */}
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

        {/* 인원수 */}
        <FilterSection>
          <FilterTitle>인원수</FilterTitle>
          <GuestInput>
            <GuestBtn onClick={() => setGuests((g) => Math.max(1, g - 1))}>
              −
            </GuestBtn>
            <GuestCount>{guests}명</GuestCount>
            <GuestBtn onClick={() => setGuests((g) => g + 1)}>+</GuestBtn>
          </GuestInput>
        </FilterSection>

        <Divider />

        {/* 가격대 */}
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
        <FilterSection>
          <FilterTitle>공통 편의시설</FilterTitle>
          {AMENITY_OPTIONS.공통.map((a) => (
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

        <FilterSection>
          <FilterTitle>숙박 편의시설</FilterTitle>
          {AMENITY_OPTIONS.숙박.map((a) => (
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

        <FilterSection>
          <FilterTitle>오피스 편의시설</FilterTitle>
          {AMENITY_OPTIONS.오피스.map((a) => (
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

        <ResetBtn onClick={resetFilter}>필터 초기화</ResetBtn>
      </SideFilter>

      {/* ── 메인 콘텐츠 ── */}
      <Main>
        {/* 검색 조건 칩 */}
        <SearchBarRow>
          <SearchChip>📍 {region === '전체' ? '전체 지역' : region}</SearchChip>
          <SearchChip>📅 5월 8일 ~ 5월 10일</SearchChip>
          <SearchChip>👤 {guests}명</SearchChip>
          <ChangeBtn>조건 변경</ChangeBtn>
        </SearchBarRow>

        {/* 결과 헤더 */}
        <ResultHeaderRow>
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: COLOR.gray400,
                letterSpacing: '.1em',
                marginBottom: 4,
              }}
            >
              SEARCH RESULTS
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  fontFamily: "'DM Serif Display', serif",
                }}
              >
                검색 결과
              </span>
              <span
                style={{ fontSize: 16, color: COLOR.sage, fontWeight: 600 }}
              >
                {filtered.length}개
              </span>
            </div>
            <div style={{ fontSize: 13, color: COLOR.gray400, marginTop: 2 }}>
              필터와 정렬로 원하는 공간을 찾아보세요
            </div>
          </div>
          <ViewToggle>
            <ViewBtn $active>🗂 리스트</ViewBtn>
            <ViewBtn onClick={() => navigate('/spaces/search/map')}>
              🗺 지도
            </ViewBtn>
          </ViewToggle>
        </ResultHeaderRow>

        {/* 유형 탭 */}
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

        {/* 정렬 */}
        <SortRow>
          <SortSelect value={sort} onChange={(e) => setSort(e.target.value)}>
            <option>인기순</option>
            <option>가격 낮은순</option>
            <option>가격 높은순</option>
            <option>평점순</option>
          </SortSelect>
        </SortRow>

        {/* 카드 그리드 */}
        <Grid>
          {filtered.length > 0 ? (
            filtered.map((item) => <SpaceCard key={item.id} item={item} />)
          ) : (
            <EmptyBox>
              🔍 조건에 맞는 공간이 없어요
              <br />
              <span style={{ fontSize: 12, marginTop: 6, display: 'block' }}>
                필터를 조정해보세요
              </span>
            </EmptyBox>
          )}
        </Grid>
      </Main>
    </Layout>
  );
}

export default SearchResultPage;
