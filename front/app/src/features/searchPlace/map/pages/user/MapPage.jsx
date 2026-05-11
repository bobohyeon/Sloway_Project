import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { COLOR } from '../../../../rsvn/components/user/RsvnStyled';

const SPACES = [
  {
    id: 1,
    type: '워크앤스테이',
    title: '청평 숲속 파인뷰',
    score: 4.9,
    price: 185000,
    icon: '🌲',
    x: 22,
    y: 38,
  },
  {
    id: 2,
    type: '오피스',
    title: '강릉 바다향 커먼워크',
    score: 4.8,
    price: 28000,
    icon: '🌊',
    x: 58,
    y: 32,
    selected: true,
  },
  {
    id: 3,
    type: '숙소',
    title: '제주 돌담집 리트릿',
    score: 4.9,
    price: 220000,
    icon: '🌴',
    x: 30,
    y: 60,
  },
  {
    id: 4,
    type: '워크앤스테이',
    title: '남해 올리브 팜스테이',
    score: 4.92,
    price: 165000,
    icon: '✉️',
    x: 15,
    y: 72,
  },
  {
    id: 5,
    type: '오피스',
    title: '성수 브릭라운지',
    score: 4.88,
    price: 25000,
    icon: '🧱',
    x: 42,
    y: 55,
  },
  {
    id: 6,
    type: '숙소',
    title: '양양 파도소리 빌라',
    score: 4.95,
    price: 240000,
    icon: '🌅',
    x: 70,
    y: 48,
  },
  {
    id: 7,
    type: '워크앤스테이',
    title: '속초 설악 글램스테이',
    score: 4.87,
    price: 210000,
    icon: '⛰️',
    x: 82,
    y: 22,
  },
];

const Wrap = styled.div`
  display: flex;
  height: 100vh;
  font-family: 'Noto Sans KR', sans-serif;
  overflow: hidden;
`;

// ── 상단 검색바 ───────────────────────────────────────────
const TopBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: #fff;
  border-bottom: 1px solid ${COLOR.gray200};
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const BackBtn = styled.button`
  font-size: 13px;
  color: ${COLOR.gray600};
  background: none;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 4px;
  &:hover {
    color: ${COLOR.black};
  }
`;

const SearchInput = styled.div`
  flex: 1;
  max-width: 300px;
  padding: 8px 14px;
  border: 1px solid ${COLOR.gray200};
  border-radius: 20px;
  font-size: 13px;
  color: ${COLOR.gray400};
  background: ${COLOR.gray100};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const FilterChip = styled.div`
  padding: 6px 12px;
  border-radius: 16px;
  border: 1px solid ${COLOR.gray200};
  background: #fff;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  &:hover {
    border-color: ${COLOR.sage};
  }
`;

const FilterPlusChip = styled(FilterChip)`
  border-style: dashed;
  color: ${COLOR.gray400};
`;

// ── 좌측 목록 ─────────────────────────────────────────────
const ListPanel = styled.div`
  width: 320px;
  flex-shrink: 0;
  margin-top: 56px;
  overflow-y: auto;
  border-right: 1px solid ${COLOR.gray200};
  background: #fff;
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid ${COLOR.gray200};
`;

const ListCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  background: ${({ $selected }) => ($selected ? COLOR.greenLight : '#fff')};
  transition: background 0.15s;
  &:hover {
    background: ${COLOR.cream};
  }
`;

const ListThumb = styled.div`
  width: 52px;
  height: 52px;
  background: ${COLOR.cream};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
`;

const TypeTag = styled.span`
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(168, 184, 159, 0.18);
  color: #5b6b53;
`;

// ── 지도 영역 ─────────────────────────────────────────────
const MapArea = styled.div`
  flex: 1;
  margin-top: 56px;
  position: relative;
  background: #e8efe0;
  overflow: hidden;
`;

const MapGrid = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px);
  background-size: 40px 40px;
`;

const CultureBtn = styled.button`
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 8px 16px;
  border-radius: 20px;
  border: none;
  background: ${COLOR.terra};
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const ZoomBtns = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ZoomBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid ${COLOR.gray200};
  background: #fff;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: ${COLOR.gray100};
  }
`;

const MapPin = styled.div`
  position: absolute;
  transform: translate(-50%, -100%);
  cursor: pointer;
`;

const PinBubble = styled.div`
  padding: 5px 10px;
  border-radius: 16px;
  background: ${({ $selected }) => ($selected ? COLOR.green : '#fff')};
  color: ${({ $selected }) => ($selected ? '#fff' : COLOR.black)};
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border: 1.5px solid
    ${({ $selected }) => ($selected ? COLOR.green : COLOR.gray200)};
  white-space: nowrap;
  transition: all 0.15s;
  &:hover {
    background: ${COLOR.green};
    color: #fff;
    transform: scale(1.05);
  }
`;

const PinTail = styled.div`
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid ${({ $selected }) => ($selected ? COLOR.green : '#fff')};
  margin: 0 auto;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1));
`;

// ── 선택된 공간 팝업 ──────────────────────────────────────
const SpacePopup = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 260px;
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.2);
  }
`;

function MapPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(1); // 강릉 선택 기본값
  const [cultureOn, setCultureOn] = useState(true);

  const selectedSpace = SPACES.find((s) => s.id === selected);

  const handleCardClick = (id) => {
    const space = SPACES.find((s) => s.id === id);
    if (!space) return;
    const path =
      space.type === '오피스'
        ? `/coworking-offices/${id}`
        : space.type === '워크앤스테이'
          ? `/workstays/${id}`
          : `/accommodations/${id}`;
    navigate(path);
  };

  return (
    <Wrap>
      {/* 상단 바 */}
      <TopBar>
        <BackBtn onClick={() => navigate('/spaces/search')}>← 목록으로</BackBtn>
        <SearchInput>🔍 지역으로 검색 · 강릉, 제주, 양양...</SearchInput>
        <FilterChip>📍 강릉</FilterChip>
        <FilterChip>📅 5/8~5/10</FilterChip>
        <FilterPlusChip>필터 +</FilterPlusChip>
      </TopBar>

      {/* 좌측 목록 */}
      <ListPanel>
        <ListHeader>
          <span style={{ fontSize: 14, fontWeight: 700 }}>
            {SPACES.length}개 공간
          </span>
          <select
            style={{
              fontSize: 12,
              border: `1px solid ${COLOR.gray200}`,
              borderRadius: 6,
              padding: '4px 8px',
              outline: 'none',
            }}
          >
            <option>인기순</option>
            <option>가격 낮은순</option>
            <option>평점순</option>
          </select>
        </ListHeader>

        {SPACES.map((s) => (
          <ListCard
            key={s.id}
            $selected={selected === s.id}
            onClick={() => setSelected(s.id)}
          >
            <ListThumb>{s.icon}</ListThumb>
            <div style={{ flex: 1, minWidth: 0 }}>
              <TypeTag>{s.type}</TypeTag>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  margin: '3px 0 2px',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
              >
                {s.title}
              </div>
              <div style={{ fontSize: 12, color: '#C97D4C' }}>★ {s.score}</div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
              {s.price.toLocaleString()}원~
            </div>
          </ListCard>
        ))}
      </ListPanel>

      {/* 지도 */}
      <MapArea>
        <MapGrid />

        <CultureBtn onClick={() => setCultureOn((v) => !v)}>
          🏛 주변 문화·관광지 {cultureOn ? 'ON' : 'OFF'}
        </CultureBtn>

        <ZoomBtns>
          <ZoomBtn>+</ZoomBtn>
          <ZoomBtn>−</ZoomBtn>
        </ZoomBtns>

        {/* 핀 마커 */}
        {SPACES.map((s) => (
          <MapPin
            key={s.id}
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
            onClick={() => setSelected(s.id)}
          >
            <PinBubble $selected={selected === s.id}>
              {s.price >= 1000 ? `${Math.round(s.price / 1000)}K` : s.price}
            </PinBubble>
            <PinTail $selected={selected === s.id} />
          </MapPin>
        ))}

        {/* 선택된 공간 팝업 */}
        {selectedSpace && (
          <SpacePopup onClick={() => handleCardClick(selectedSpace.id)}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  background: COLOR.cream,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                }}
              >
                {selectedSpace.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <TypeTag>{selectedSpace.type}</TypeTag>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    margin: '3px 0 2px',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {selectedSpace.title}
                </div>
                <div style={{ fontSize: 12, color: '#C97D4C' }}>
                  ★ {selectedSpace.score}
                </div>
              </div>
            </div>
            <div
              style={{
                marginTop: 10,
                paddingTop: 10,
                borderTop: `1px solid ${COLOR.gray200}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 700 }}>
                {selectedSpace.price.toLocaleString()}원~
              </span>
              <span
                style={{ fontSize: 12, color: COLOR.green, fontWeight: 600 }}
              >
                상세 보기 →
              </span>
            </div>
          </SpacePopup>
        )}
      </MapArea>
    </Wrap>
  );
}

export default MapPage;
