import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import SpaceCard from '../../components/user/SpaceCard';
import MainHeader from '../../../../main/layouts/MainHeader';
import { COLOR } from '../../../../rsvn/components/user/RsvnStyled';
import { searchSpaces } from '../../../api/searchApi';

// 타입별 기본 아이콘 · 가격 단위 (DB 영문 대문자 기준)
const TYPE_ICON  = { WORK_STAY: '🌿', OFFICE: '💻', STATION: '🛌' };
const TYPE_UNIT  = { WORK_STAY: '원/박', OFFICE: '원/4h', STATION: '원/박' };

// 탭 한글 → API 타입값 매핑
const TAB_TO_TYPE = { '워크앤스테이': 'WORK_STAY', '오피스': 'OFFICE', '숙소': 'STATION' };

// SearchResDto → SpaceCard 호환 객체
function toSpaceCard(dto) {
  return {
    id: dto.entityNo,
    placeNo: dto.placeNo,
    type: dto.type,
    title: dto.title,
    location: dto.address,
    score: Math.round(dto.avgScore ?? 0),
    reviewCount: dto.reviewCount ?? 0,
    price: dto.basePrice ?? 0,
    priceUnit: TYPE_UNIT[dto.type] ?? '원~',
    amenities: [],
    roomLeft: dto.remainCount ?? null,
    soldOut: dto.available === false,
    icon: TYPE_ICON[dto.type] ?? '🏠',
  };
}

const TYPE_TABS = ['전체', '워크앤스테이', '오피스', '숙소'];
const REGIONS = [
  '전체',
  '서울',
  '경기',
  '인천',
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

const DateInput = styled.input`
  width: 100%;
  padding: 7px 10px;
  border: 1px solid ${COLOR.gray200};
  border-radius: 8px;
  font-size: 13px;
  font-family: 'Noto Sans KR', sans-serif;
  outline: none;
  cursor: pointer;
  box-sizing: border-box;
  &:focus { border-color: ${COLOR.sage}; }
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
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  // 페이지 이동할 때 state 반영
  useEffect(() => {
    if (state?.type) {
      const idx = TYPE_TABS.indexOf(state.type);
      if (idx >= 0) setActiveTab(idx);
    }
    if (state?.region) setRegion(state.region);
    if (state?.guests) setGuests(state.guests);
    if (state?.checkIn) setCheckIn(state.checkIn);
    if (state?.checkOut) setCheckOut(state.checkOut);
  }, [state]);

  // 타입·지역·정렬·날짜 변경 시 API 재조회
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const placeType = activeTab > 0 ? TAB_TO_TYPE[TYPE_TABS[activeTab]] : null;
        const data = await searchSpaces({ region, placeType, sort, checkIn, checkOut });
        setSpaces(data.map(toSpaceCard));
      } catch (e) {
        console.error(e);
        setSpaces([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [activeTab, region, sort, checkIn, checkOut]);

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
    setCheckIn('');
    setCheckOut('');
  };

  // 타입·가격 필터 + 정렬을 클라이언트에서 처리 (서버 필터 백업)
  const filtered = useMemo(() => {
    let result = spaces;

    // 타입 필터 (서버 필터 백업 — 오피스 선택 시 오피스만)
    if (activeTab > 0) {
      const targetType = TAB_TO_TYPE[TYPE_TABS[activeTab]];
      result = result.filter((s) => s.type === targetType);
    }

    // 가격 필터
    if (priceIdx > 0) {
      const { min, max } = PRICE_RANGES[priceIdx];
      result = result.filter((s) => s.price >= min && s.price <= max);
    }

    // 정렬
    switch (sort) {
      case '가격 낮은순': return [...result].sort((a, b) => a.price - b.price);
      case '가격 높은순': return [...result].sort((a, b) => b.price - a.price);
      case '평점순':      return [...result].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
      default:            return result;
    }
  }, [spaces, activeTab, priceIdx, sort]);

  // 카드 클릭 → 방 리스트 페이지
  const handleCardClick = (item) => {
    navigate(`/spaces/${item.id}/rooms`, {
      state: {
        space: item,
        checkIn,
        checkOut,
        guests,
      },
    });
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
            <FilterTitle>체크인 · 체크아웃</FilterTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <DateInput
                type="date"
                value={checkIn}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => {
                  setCheckIn(e.target.value);
                  // 체크인이 체크아웃보다 늦으면 체크아웃 초기화
                  if (checkOut && e.target.value >= checkOut) setCheckOut('');
                }}
              />
              <DateInput
                type="date"
                value={checkOut}
                min={checkIn || new Date().toISOString().slice(0, 10)}
                disabled={!checkIn}
                onChange={(e) => setCheckOut(e.target.value)}
                style={{ opacity: checkIn ? 1 : 0.5, cursor: checkIn ? 'pointer' : 'not-allowed' }}
              />
              {checkIn && checkOut && (
                <span style={{ fontSize: 11, color: COLOR.gray400 }}>
                  {Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000)}박
                </span>
              )}
            </div>
          </FilterSection>

          <Divider />

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
              <ViewBtn
                onClick={() =>
                  navigate('/spaces/search/map', {
                    state: {
                      type: TYPE_TABS[activeTab],
                      region,
                      checkIn,
                      checkOut,
                      guests,
                    },
                  })
                }
              >
                🗺 지도
              </ViewBtn>
            </ViewToggle>
          </TopRow>

          <SearchChips>
            <Chip>📍 {region === '전체' ? '전체 지역' : region}</Chip>
            <Chip>
              📅{' '}
              {checkIn && checkOut
                ? `${checkIn.slice(5).replace('-', '월 ')}일 ~ ${checkOut.slice(5).replace('-', '월 ')}일`
                : '날짜 미선택'}
            </Chip>
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
            {loading ? (
              <EmptyBox>🔍 검색 중...</EmptyBox>
            ) : filtered.length > 0 ? (
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
