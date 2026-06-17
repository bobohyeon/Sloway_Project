import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import MainHeader from '../../../../main/layouts/MainHeader';
import { COLOR } from '../../../../rsvn/components/user/RsvnStyled';
import { searchSpaces } from '../../../api/searchApi';
import {
  addLikePlace,
  deleteLikePlace,
  fetchLikePlaceList,
} from '../../../../wishList/api/wishListApi';

// SearchResultPage와 동일한 상수
const TYPE_TABS = ['전체', '워크앤스테이', '오피스', '숙소'];
const TAB_TO_TYPE = {
  워크앤스테이: 'WORK_STAY',
  오피스: 'OFFICE',
  숙소: 'STATION',
};
const TYPE_LABEL = {
  OFFICE: '코워킹오피스',
  WORK_STAY: '워크앤스테이',
  STATION: '숙소',
};
const REGIONS = [
  '전체',
  '서울',
  '경기',
  '인천',
  '강원',
  '경상',
  '충청',
  '전라',
  '제주',
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

/* ── 레이아웃 ── */
const Layout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: 'Noto Sans KR', sans-serif;
  overflow: hidden;
`;

const SubBar = styled.div`
  background: #fff;
  border-bottom: 1px solid ${COLOR.gray200};
  padding: 9px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const BackBtn = styled.button`
  font-size: 13px;
  color: ${COLOR.gray600};
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  &:hover {
    color: ${COLOR.black};
  }
`;

const Chip = styled.div`
  padding: 5px 12px;
  border-radius: 16px;
  border: 1px solid ${COLOR.gray200};
  background: #fff;
  font-size: 12px;
  font-weight: 500;
`;

const ViewBtn = styled.button`
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid ${COLOR.green};
  background: #fff;
  color: ${COLOR.green};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
`;

const Body = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

/* ── 사이드 필터 (SearchResultPage와 동일 구조) ── */
const SideFilter = styled.aside`
  width: 220px;
  flex-shrink: 0;
  padding: 20px 16px;
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
  margin-bottom: 18px;
`;

const FilterTitle = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: ${COLOR.gray400};
  letter-spacing: 0.06em;
  margin-bottom: 10px;
`;

const TypeTabRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

const TypeChip = styled.button`
  padding: 5px 10px;
  border-radius: 16px;
  border: 1px solid ${({ $active }) => ($active ? COLOR.green : COLOR.gray200)};
  background: ${({ $active }) => ($active ? COLOR.greenLight : '#fff')};
  color: ${({ $active }) => ($active ? COLOR.green : COLOR.gray600)};
  font-size: 11px;
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
  cursor: pointer;
`;

const RadioRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: ${({ $active }) => ($active ? COLOR.green : COLOR.gray600)};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  margin-bottom: 6px;
  cursor: pointer;
  input {
    accent-color: ${COLOR.green};
  }
`;

const CheckRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: ${COLOR.gray600};
  margin-bottom: 6px;
  cursor: pointer;
  input {
    accent-color: ${COLOR.green};
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${COLOR.gray200};
  margin: 12px 0;
`;

const DateInput = styled.input`
  width: 100%;
  padding: 6px 8px;
  border: 1px solid ${COLOR.gray200};
  border-radius: 8px;
  font-size: 12px;
  font-family: 'Noto Sans KR', sans-serif;
  outline: none;
  box-sizing: border-box;
  &:focus {
    border-color: ${COLOR.sage};
  }
`;

const GuestInput = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const GuestBtn = styled.button`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1px solid ${COLOR.gray200};
  background: #fff;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    border-color: ${COLOR.sage};
  }
`;

const ResetBtn = styled.button`
  width: 100%;
  padding: 8px;
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

/* ── 공간 목록 패널 (지도 왼쪽, 고정 너비) ── */
const ListPanel = styled.div`
  width: 270px;
  flex-shrink: 0;
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

const ListHeader = styled.div`
  padding: 12px 14px;
  border-bottom: 1px solid ${COLOR.gray200};
  font-size: 13px;
  font-weight: 700;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 1;
`;

const ListCard = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  background: ${({ $selected }) => ($selected ? COLOR.greenLight : '#fff')};
  transition: background 0.15s;
  &:hover {
    background: ${COLOR.cream};
  }
`;

const ListThumb = styled.div`
  width: 44px;
  height: 44px;
  background: ${COLOR.cream};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
  overflow: hidden;
`;

const TypeTag = styled.span`
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(168, 184, 159, 0.18);
  color: #5b6b53;
`;

/* ── 지도 영역 ── */
const MapArea = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
`;

/* ── 공간 상세 패널 (지도 위에 오버레이, 우측) ── */
const DetailPanel = styled.div`
  position: absolute;
  right: ${({ $open }) => ($open ? '0' : '-310px')};
  top: 0;
  bottom: 0;
  width: 290px;
  background: #fff;
  border-left: 1px solid ${COLOR.gray200};
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  overflow-y: auto;
  z-index: 10;
  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: #d8d3cb;
    border-radius: 10px;
  }
`;

const PanelToggleBtn = styled.button`
  position: absolute;
  left: -32px;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 64px;
  border-radius: 8px 0 0 8px;
  border: 1px solid ${COLOR.gray200};
  border-right: none;
  background: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.08);
`;

const PanelInner = styled.div`
  padding: 16px;
`;

/* ════════════════════════════════════════════ */

function MapPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const overlaysRef = useRef([]);

  // SearchResultPage에서 넘어올 때 state로 필터 초기값 수신
  const [activeTab, setActiveTab] = useState(() => {
    const idx = TYPE_TABS.indexOf(state?.type ?? '');
    return idx >= 0 ? idx : 0;
  });
  const [region, setRegion] = useState(state?.region || '전체');
  const [checkIn, setCheckIn] = useState(state?.checkIn || '');
  const [checkOut, setCheckOut] = useState(state?.checkOut || '');
  const [guests, setGuests] = useState(state?.guests || 2);
  const [priceIdx, setPriceIdx] = useState(0);
  const [amenities, setAmenities] = useState([]);

  const [spaces, setSpaces] = useState([]);
  const [selected, setSelected] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeNo, setLikeNo] = useState(null);

  // 카카오맵 초기화 (마운트 1회)
  useEffect(() => {
    const map = new window.kakao.maps.Map(mapContainerRef.current, {
      center: new window.kakao.maps.LatLng(36.5, 127.5),
      level: 12,
    });
    mapInstanceRef.current = map;
  }, []);

  // 필터 변경 시 공간 목록 재조회
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const placeType =
          activeTab > 0 ? TAB_TO_TYPE[TYPE_TABS[activeTab]] : null;
        const data = await searchSpaces({
          region: region !== '전체' ? region : undefined,
          placeType,
          checkIn,
          checkOut,
        });
        setSpaces(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [activeTab, region, checkIn, checkOut]);

  // spaces 변경 시 마커 오버레이 갱신
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    overlaysRef.current.forEach((ov) => ov.setMap(null));
    overlaysRef.current = [];

    if (!spaces.length) return;

    const bounds = new window.kakao.maps.LatLngBounds();
    let hasBounds = false;

    spaces.forEach((space) => {
      const lat = parseFloat(space.latitude);
      const lng = parseFloat(space.longitude);
      if (isNaN(lat) || isNaN(lng)) return;

      const pos = new window.kakao.maps.LatLng(lat, lng);
      bounds.extend(pos);
      hasBounds = true;

      const wrap = document.createElement('div');
      wrap.style.cssText = 'cursor:pointer; text-align:center;';

      const bubble = document.createElement('div');
      bubble.textContent =
        space.title.length > 7 ? space.title.slice(0, 6) + '…' : space.title;
      bubble.style.cssText = [
        'padding:5px 10px',
        'border-radius:16px',
        'background:#fff',
        'font-size:12px',
        'font-weight:700',
        'box-shadow:0 2px 8px rgba(0,0,0,.15)',
        'border:1.5px solid #d8d3cb',
        'white-space:nowrap',
        "font-family:'Noto Sans KR',sans-serif",
      ].join(';');

      const tail = document.createElement('div');
      tail.style.cssText = [
        'width:0',
        'height:0',
        'border-left:5px solid transparent',
        'border-right:5px solid transparent',
        'border-top:6px solid #fff',
        'margin:0 auto',
      ].join(';');

      wrap.appendChild(bubble);
      wrap.appendChild(tail);

      wrap.addEventListener('click', () => {
        setSelected(space);
        setPanelOpen(true);
        map.panTo(pos);
      });

      const overlay = new window.kakao.maps.CustomOverlay({
        position: pos,
        content: wrap,
        yAnchor: 1,
      });
      overlay.setMap(map);
      overlaysRef.current.push(overlay);
    });

    if (hasBounds) map.setBounds(bounds);
  }, [spaces]);

  // selected 바뀔 때 찜 상태 초기화
  useEffect(() => {
    setLiked(false);
    setLikeNo(null);
  }, [selected?.placeNo]);

  const handleWish = async (e) => {
    e.stopPropagation();
    if (!localStorage.getItem('accessToken')) {
      alert('로그인 후 이용해주세요.');
      return;
    }
    const prevLiked = liked;
    const prevLikeNo = likeNo;
    try {
      if (liked) {
        setLiked(false);
        setLikeNo(null);
        await deleteLikePlace(likeNo);
      } else {
        setLiked(true);
        await addLikePlace(selected.placeNo);
        const listRes = await fetchLikePlaceList();
        const found = (listRes.data ?? []).find(l => l.placeNo === selected.placeNo);
        setLikeNo(found?.no ?? null);
      }
    } catch {
      setLiked(prevLiked);
      setLikeNo(prevLikeNo);
    }
  };

  const toggleAmenity = (a) =>
    setAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );

  const reset = () => {
    setActiveTab(0);
    setRegion('전체');
    setCheckIn('');
    setCheckOut('');
    setGuests(2);
    setPriceIdx(0);
    setAmenities([]);
  };

  const handleListCardClick = (space) => {
    setSelected(space);
    setPanelOpen(true);
    const lat = parseFloat(space.latitude);
    const lng = parseFloat(space.longitude);
    if (!isNaN(lat) && !isNaN(lng) && mapInstanceRef.current) {
      mapInstanceRef.current.panTo(new window.kakao.maps.LatLng(lat, lng));
    }
  };

  // 리스트 보기 — 현재 필터 state를 SearchResultPage로 전달
  const goListView = () => {
    navigate('/spaces/search', {
      state: {
        type: TYPE_TABS[activeTab],
        region,
        checkIn,
        checkOut,
        guests,
      },
    });
  };

  return (
    <Layout>
      <MainHeader activePage="search" />

      {/* 상단 현재 필터 요약 바 */}
      <SubBar>
        <BackBtn onClick={() => navigate(-1)}>← 이전으로</BackBtn>
        <Chip>📍 {region === '전체' ? '전체 지역' : region}</Chip>
        <Chip>
          📅{' '}
          {checkIn && checkOut
            ? `${checkIn.slice(5).replace('-', '/')} ~ ${checkOut.slice(5).replace('-', '/')}`
            : '날짜 미선택'}
        </Chip>
        <Chip>👤 {guests}명</Chip>
        <div style={{ marginLeft: 'auto' }}>
          <ViewBtn onClick={goListView}>🗂 리스트 보기</ViewBtn>
        </div>
      </SubBar>

      <Body>
        {/* 사이드 필터 — SearchResultPage와 동일 구조 */}
        <SideFilter>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: COLOR.black,
              marginBottom: 16,
            }}
          >
            필터
          </div>

          <FilterSection>
            <FilterTitle>공간 유형</FilterTitle>
            <TypeTabRow>
              {TYPE_TABS.map((tab, i) => (
                <TypeChip
                  key={tab}
                  $active={activeTab === i}
                  onClick={() => setActiveTab(i)}
                >
                  {tab}
                </TypeChip>
              ))}
            </TypeTabRow>
          </FilterSection>

          <Divider />

          <FilterSection>
            <FilterTitle>체크인 · 체크아웃</FilterTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <DateInput
                type="date"
                value={checkIn}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => {
                  setCheckIn(e.target.value);
                  if (checkOut && e.target.value >= checkOut) setCheckOut('');
                }}
              />
              <DateInput
                type="date"
                value={checkOut}
                min={checkIn || new Date().toISOString().slice(0, 10)}
                disabled={!checkIn}
                onChange={(e) => setCheckOut(e.target.value)}
                style={{
                  opacity: checkIn ? 1 : 0.5,
                  cursor: checkIn ? 'pointer' : 'not-allowed',
                }}
              />
              {checkIn && checkOut && (
                <span style={{ fontSize: 11, color: COLOR.gray400 }}>
                  {Math.round(
                    (new Date(checkOut) - new Date(checkIn)) / 86400000
                  )}
                  박
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
                  name="map-region"
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
                  fontSize: 13,
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
                  name="map-price"
                  checked={priceIdx === i}
                  onChange={() => setPriceIdx(i)}
                />
                {p.label}
              </RadioRow>
            ))}
          </FilterSection>

          <Divider />

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

        {/* 공간 목록 패널 */}
        <ListPanel>
          <ListHeader>
            {loading ? '불러오는 중...' : `${spaces.length}개 공간`}
          </ListHeader>
          {spaces.map((s) => (
            <ListCard
              key={s.placeNo}
              $selected={selected?.placeNo === s.placeNo}
              onClick={() => handleListCardClick(s)}
            >
              <ListThumb>
                {s.thumbnailUrl ? (
                  <img
                    src={s.thumbnailUrl}
                    alt=""
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <span>🏠</span>
                )}
              </ListThumb>
              <div style={{ flex: 1, minWidth: 0 }}>
                <TypeTag>{TYPE_LABEL[s.type] ?? s.type}</TypeTag>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    margin: '3px 0 2px',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {s.title}
                </div>
                <div style={{ fontSize: 11, color: '#C97D4C' }}>
                  {s.avgScore
                    ? `★ ${Number(s.avgScore).toFixed(1)}`
                    : '평점 없음'}
                </div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                {s.basePrice ? `${s.basePrice.toLocaleString()}원~` : '-'}
              </div>
            </ListCard>
          ))}
        </ListPanel>

        {/* 카카오 지도 */}
        <MapArea>
          <div
            ref={mapContainerRef}
            style={{ width: '100%', height: '100%' }}
          />

          {/* 공간 상세 패널 (지도 위 오버레이, 우측) */}
          <DetailPanel $open={panelOpen}>
            <PanelToggleBtn onClick={() => setPanelOpen((v) => !v)}>
              {panelOpen ? '›' : '‹'}
            </PanelToggleBtn>

            {selected && (
              <PanelInner>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <TypeTag>
                    {TYPE_LABEL[selected.type] ?? selected.type}
                  </TypeTag>
                  <button
                    onClick={handleWish}
                    style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: '#fff', border: '1px solid #e8dfd0',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 15, cursor: 'pointer',
                      color: liked ? '#e74c3c' : '#999',
                      boxShadow: '0 2px 6px rgba(0,0,0,.1)',
                    }}
                  >
                    {liked ? '♥' : '♡'}
                  </button>
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    marginBottom: 4,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {selected.title}
                </div>
                <div
                  style={{ fontSize: 12, color: '#C97D4C', marginBottom: 4 }}
                >
                  {selected.avgScore
                    ? `★ ${Number(selected.avgScore).toFixed(1)}`
                    : '평점 없음'}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: COLOR.gray400,
                    marginBottom: 10,
                  }}
                >
                  {selected.address}
                </div>
                <div
                  style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}
                >
                  {selected.basePrice
                    ? `${selected.basePrice.toLocaleString()}원~`
                    : '가격 문의'}
                </div>
                <button
                  onClick={() =>
                    navigate(`/spaces/${selected.placeNo}/rooms`, {
                      state: { space: selected, checkIn, checkOut, guests },
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '9px',
                    borderRadius: 8,
                    background: COLOR.green,
                    color: '#fff',
                    border: 'none',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  상세 보기
                </button>
              </PanelInner>
            )}
          </DetailPanel>
        </MapArea>
      </Body>
    </Layout>
  );
}

export default MapPage;
