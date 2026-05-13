import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import MainHeader from '../../../../main/layouts/MainHeader';
import { COLOR } from '../../../../rsvn/components/user/RsvnStyled';

const SPACES = [
  {
    id: 1,
    type: '워크앤스테이',
    title: '청평 숲속 파인뷰',
    location: '경기 가평',
    score: 4.9,
    price: 185000,
    icon: '🌲',
    x: 22,
    y: 38,
    roomCount: 3,
  },
  {
    id: 2,
    type: '오피스',
    title: '강릉 바다향 커먼워크',
    location: '강원 강릉',
    score: 4.8,
    price: 28000,
    icon: '🌊',
    x: 58,
    y: 32,
    roomCount: 3,
  },
  {
    id: 3,
    type: '숙소',
    title: '제주 돌담집 리트릿',
    location: '제주 서귀포',
    score: 4.9,
    price: 220000,
    icon: '🌴',
    x: 30,
    y: 60,
    roomCount: 2,
  },
  {
    id: 4,
    type: '워크앤스테이',
    title: '남해 올리브 팜스테이',
    location: '경남 남해',
    score: 4.92,
    price: 165000,
    icon: '✉️',
    x: 15,
    y: 72,
    roomCount: 2,
  },
  {
    id: 5,
    type: '오피스',
    title: '성수 브릭라운지',
    location: '서울 성수',
    score: 4.88,
    price: 25000,
    icon: '🧱',
    x: 42,
    y: 55,
    roomCount: 4,
  },
  {
    id: 6,
    type: '숙소',
    title: '양양 파도소리 빌라',
    location: '강원 양양',
    score: 4.95,
    price: 240000,
    icon: '🌅',
    x: 70,
    y: 48,
    roomCount: 2,
  },
  {
    id: 7,
    type: '워크앤스테이',
    title: '속초 설악 글램스테이',
    location: '강원 속초',
    score: 4.87,
    price: 210000,
    icon: '⛰️',
    x: 82,
    y: 22,
    roomCount: 1,
  },
];

const DUMMY_ROOMS = {
  1: [
    {
      id: 'r1',
      name: '파인뷰 독채 A동',
      maxGuests: 4,
      price: 185000,
      priceUnit: '원/박',
      available: true,
      icon: '🌲',
    },
    {
      id: 'r2',
      name: '파인뷰 독채 B동',
      maxGuests: 6,
      price: 240000,
      priceUnit: '원/박',
      available: true,
      icon: '🌲',
    },
    {
      id: 'r3',
      name: '파인뷰 글램핑',
      maxGuests: 2,
      price: 150000,
      priceUnit: '원/박',
      available: false,
      icon: '⛺',
    },
  ],
  2: [
    {
      id: 'r4',
      name: '오션뷰 오픈석',
      maxGuests: 1,
      price: 28000,
      priceUnit: '원/4h',
      available: true,
      icon: '🌊',
    },
    {
      id: 'r5',
      name: '프라이빗 부스',
      maxGuests: 2,
      price: 45000,
      priceUnit: '원/4h',
      available: true,
      icon: '🎧',
    },
    {
      id: 'r6',
      name: '팀 회의실',
      maxGuests: 8,
      price: 80000,
      priceUnit: '원/4h',
      available: true,
      icon: '🏢',
    },
  ],
};

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: 'Noto Sans KR', sans-serif;
  overflow: hidden;
`;

// 상단 검색바 (헤더 아래)
const SubBar = styled.div`
  background: #fff;
  border-bottom: 1px solid ${COLOR.gray200};
  padding: 10px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
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

const Select = styled.select`
  padding: 6px 10px;
  border: 1px solid ${COLOR.gray200};
  border-radius: 8px;
  font-size: 12px;
  background: #fff;
  outline: none;
`;

const Body = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

// 좌측 목록
const ListPanel = styled.div`
  width: 320px;
  flex-shrink: 0;
  overflow-y: auto;
  border-right: 1px solid ${COLOR.gray200};
  background: #fff;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: #d8d3cb;
    border-radius: 10px;
  }
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid ${COLOR.gray200};
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 1;
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

// 지도 영역
const MapArea = styled.div`
  flex: 1;
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
`;

const PinTail = styled.div`
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid ${({ $selected }) => ($selected ? COLOR.green : '#fff')};
  margin: 0 auto;
`;

// 사이드 방 리스트 패널 (네이버지도 스타일)
const RoomPanel = styled.div`
  position: absolute;
  right: ${({ $open }) => ($open ? '0' : '-320px')};
  top: 0;
  bottom: 0;
  width: 300px;
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

const PanelHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${COLOR.gray200};
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 1;
`;

const RoomItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #f5f5f5;
  cursor: ${({ $avail }) => ($avail ? 'pointer' : 'not-allowed')};
  opacity: ${({ $avail }) => ($avail ? 1 : 0.55)};
  transition: background 0.15s;
  &:hover {
    background: ${({ $avail }) => ($avail ? COLOR.cream : 'none')};
  }
`;

const RoomIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${COLOR.cream};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
`;

const AvailDot = styled.div`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${({ $avail }) => ($avail ? COLOR.green : COLOR.red)};
  flex-shrink: 0;
`;

function MapPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(1);
  const [cultureOn, setCultureOn] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [regionFilter, setRegionFilter] = useState('전체');

  const selectedSpace = SPACES.find((s) => s.id === selected);
  const rooms = DUMMY_ROOMS[selected] || [];

  const handlePinClick = (id) => {
    setSelected(id);
    setPanelOpen(true);
  };

  const handleRoomClick = (room) => {
    if (!room.available) return;
    const space = selectedSpace;
    const path =
      space.type === '오피스'
        ? `/coworking-offices/${space.id}`
        : space.type === '워크앤스테이'
          ? `/workstays/${space.id}`
          : `/accommodations/${space.id}`;
    navigate(path, { state: { selectedRoom: room, space } });
  };

  return (
    <Layout>
      <MainHeader activePage="search" />

      {/* 서브 필터바 */}
      <SubBar>
        <BackBtn onClick={() => navigate(-1)}>← 이전으로</BackBtn>
        <Select
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
        >
          {['전체', '서울', '경기', '전라', '경상', '충청', '제주', '강원'].map(
            (r) => (
              <option key={r}>{r}</option>
            )
          )}
        </Select>
        <FilterChip>📅 5/8~5/10</FilterChip>
        <FilterChip>👤 2명</FilterChip>
        <FilterChip>필터 +</FilterChip>
        <div style={{ marginLeft: 'auto' }}>
          <button
            onClick={() => navigate('/spaces/search')}
            style={{
              fontSize: 12,
              color: COLOR.green,
              background: 'none',
              border: `1px solid ${COLOR.green}`,
              borderRadius: 8,
              padding: '6px 12px',
              cursor: 'pointer',
            }}
          >
            🗂 리스트 보기
          </button>
        </div>
      </SubBar>

      <Body>
        {/* 좌측 목록 */}
        <ListPanel>
          <ListHeader>
            <span style={{ fontSize: 14, fontWeight: 700 }}>
              {SPACES.length}개 공간
            </span>
            <Select style={{ width: 'auto' }}>
              <option>인기순</option>
              <option>가격 낮은순</option>
              <option>평점순</option>
            </Select>
          </ListHeader>

          {SPACES.map((s) => (
            <ListCard
              key={s.id}
              $selected={selected === s.id}
              onClick={() => {
                setSelected(s.id);
                setPanelOpen(true);
              }}
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
                <div style={{ fontSize: 12, color: '#C97D4C' }}>
                  ★ {s.score}
                </div>
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

          {SPACES.map((s) => (
            <MapPin
              key={s.id}
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
              onClick={() => handlePinClick(s.id)}
            >
              <PinBubble $selected={selected === s.id}>
                {s.price >= 1000 ? `${Math.round(s.price / 1000)}K` : s.price}
              </PinBubble>
              <PinTail $selected={selected === s.id} />
            </MapPin>
          ))}

          {/* 방 리스트 사이드 패널 */}
          <RoomPanel $open={panelOpen}>
            <PanelToggleBtn onClick={() => setPanelOpen((v) => !v)}>
              {panelOpen ? '›' : '‹'}
            </PanelToggleBtn>

            {selectedSpace && (
              <>
                <PanelHeader>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      marginBottom: 10,
                    }}
                  >
                    <div style={{ fontSize: 24 }}>{selectedSpace.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <TypeTag>{selectedSpace.type}</TypeTag>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
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
                      fontSize: 13,
                      color: COLOR.gray400,
                      marginBottom: 8,
                    }}
                  >
                    방 {selectedSpace.roomCount}개 · {selectedSpace.location}
                  </div>
                  <button
                    onClick={() =>
                      navigate(`/spaces/${selectedSpace.id}/rooms`, {
                        state: { space: selectedSpace },
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: 8,
                      background: COLOR.green,
                      color: '#fff',
                      border: 'none',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    방 목록 전체 보기
                  </button>
                </PanelHeader>

                {rooms.length > 0 ? (
                  rooms.map((room) => (
                    <RoomItem
                      key={room.id}
                      $avail={room.available}
                      onClick={() => handleRoomClick(room)}
                    >
                      <RoomIcon>{room.icon}</RoomIcon>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            marginBottom: 2,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {room.name}
                        </div>
                        <div style={{ fontSize: 12, color: COLOR.gray400 }}>
                          최대 {room.maxGuests}명
                        </div>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          gap: 4,
                          flexShrink: 0,
                        }}
                      >
                        <div style={{ fontSize: 13, fontWeight: 700 }}>
                          {room.price.toLocaleString()}원
                        </div>
                        <AvailDot $avail={room.available} />
                      </div>
                    </RoomItem>
                  ))
                ) : (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: 32,
                      color: COLOR.gray400,
                      fontSize: 13,
                    }}
                  >
                    방 정보를 불러오는 중...
                  </div>
                )}
              </>
            )}
          </RoomPanel>
        </MapArea>
      </Body>
    </Layout>
  );
}

export default MapPage;
