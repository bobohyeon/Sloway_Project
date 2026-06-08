import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { findSpaceByEntityNo } from '../../../api/searchApi';
import styled, { keyframes } from 'styled-components';
import { COLOR } from '../../../../rsvn/components/user/RsvnStyled';
import MainHeader from '../../../../main/layouts/MainHeader';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${COLOR.cream};
  font-family: 'Noto Sans KR', sans-serif;
`;

const Content = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 24px;
  width: 100%;
  box-sizing: border-box;
  animation: ${fadeInUp} 480ms ease-out both;
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
  margin-bottom: 20px;
  &:hover {
    color: ${COLOR.black};
  }
`;

const SpaceSummary = styled.div`
  background: #fff;
  border: 1px solid ${COLOR.gray200};
  border-radius: 14px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 28px;
`;

const SpaceThumb = styled.div`
  width: 64px;
  height: 64px;
  background: ${COLOR.cream};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  flex-shrink: 0;
`;

const TypeTag = styled.span`
  font-size: 11px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 4px;
  background: rgba(168, 184, 159, 0.18);
  color: #5b6b53;
  display: inline-block;
  margin-bottom: 5px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${COLOR.black};
  margin-bottom: 6px;
`;

const SectionSub = styled.p`
  font-size: 13px;
  color: ${COLOR.gray400};
  margin-bottom: 20px;
`;

const RoomGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

const RoomCard = styled.div`
  background: #fff;
  border: 1px solid ${COLOR.gray200};
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition:
    box-shadow 0.2s,
    transform 0.2s;
  &:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
`;

const RoomImg = styled.div`
  height: 140px;
  background: ${({ $color }) => $color || COLOR.cream};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  position: relative;
`;

const AvailBadge = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  padding: 3px 9px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  background: ${({ $avail }) =>
    $avail ? 'rgba(45,106,79,0.85)' : 'rgba(192,57,43,0.85)'};
  color: #fff;
`;

const RoomBody = styled.div`
  padding: 14px 16px;
`;

const RoomName = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${COLOR.black};
  margin-bottom: 4px;
`;

const RoomMeta = styled.div`
  font-size: 12px;
  color: ${COLOR.gray400};
  margin-bottom: 10px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const RoomAmenities = styled.div`
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  margin-bottom: 12px;
`;

const AmenityTag = styled.span`
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  background: ${COLOR.gray100};
  color: ${COLOR.gray600};
`;

const RoomPrice = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Price = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${COLOR.black};
  span {
    font-size: 12px;
    font-weight: 400;
    color: ${COLOR.gray400};
  }
`;

const SelectBtn = styled.button`
  padding: 7px 16px;
  border-radius: 8px;
  background: ${COLOR.green};
  color: #fff;
  border: none;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background: #1a3a2a;
  }
`;

// 더미 방 데이터 — spaceId별로 다르게 (백엔드 연결 시 API 교체)
const ROOM_DATA = {
  1: [
    {
      id: 'r1',
      name: '파인뷰 독채 A동',
      maxGuests: 4,
      baseGuests: 2,
      price: 185000,
      priceUnit: '원/박',
      amenities: ['듀얼모니터', '와이파이', '회의실'],
      available: true,
      icon: '🌲',
      color: '#E8DFD0',
    },
    {
      id: 'r2',
      name: '파인뷰 독채 B동',
      maxGuests: 6,
      baseGuests: 4,
      price: 240000,
      priceUnit: '원/박',
      amenities: ['듀얼모니터', '와이파이', '주방'],
      available: true,
      icon: '🌲',
      color: '#D8E8D0',
    },
    {
      id: 'r3',
      name: '파인뷰 글램핑',
      maxGuests: 2,
      baseGuests: 2,
      price: 150000,
      priceUnit: '원/박',
      amenities: ['와이파이'],
      available: false,
      icon: '⛺',
      color: '#E0E8D0',
    },
  ],
  2: [
    {
      id: 'r4',
      name: '오션뷰 오픈석',
      maxGuests: 1,
      baseGuests: 1,
      price: 28000,
      priceUnit: '원/4h',
      amenities: ['webcam', 'PC'],
      available: true,
      icon: '🌊',
      color: '#D0E0E8',
    },
    {
      id: 'r5',
      name: '프라이빗 부스',
      maxGuests: 2,
      baseGuests: 1,
      price: 45000,
      priceUnit: '원/4h',
      amenities: ['폰부스', '모니터'],
      available: true,
      icon: '🎧',
      color: '#D8D0E8',
    },
    {
      id: 'r6',
      name: '팀 회의실',
      maxGuests: 8,
      baseGuests: 4,
      price: 80000,
      priceUnit: '원/4h',
      amenities: ['빔프로젝터', '화이트보드'],
      available: true,
      icon: '🏢',
      color: '#E0D8E8',
    },
  ],
  3: [
    {
      id: 'r7',
      name: '돌담집 본채',
      maxGuests: 4,
      baseGuests: 2,
      price: 220000,
      priceUnit: '원/박',
      amenities: ['주방', '세탁기', '어메니티'],
      available: true,
      icon: '🌴',
      color: '#E8E0D0',
    },
    {
      id: 'r8',
      name: '별채 테라스룸',
      maxGuests: 2,
      baseGuests: 2,
      price: 180000,
      priceUnit: '원/박',
      amenities: ['어메니티', '개인욕실'],
      available: false,
      icon: '🏠',
      color: '#D8E8E0',
    },
  ],
};

// 기본 더미 (id 없을 때)
const DEFAULT_ROOMS = [
  {
    id: 'default1',
    name: '스탠다드 룸',
    maxGuests: 2,
    baseGuests: 2,
    price: 150000,
    priceUnit: '원/박',
    amenities: ['와이파이', '어메니티'],
    available: true,
    icon: '🛏',
    color: '#E8E0D0',
  },
  {
    id: 'default2',
    name: '디럭스 룸',
    maxGuests: 4,
    baseGuests: 2,
    price: 200000,
    priceUnit: '원/박',
    amenities: ['와이파이', '어메니티', '주방'],
    available: true,
    icon: '🛏',
    color: '#D8E8D0',
  },
];

function RoomListPage() {
  const navigate = useNavigate();
  const { spaceId } = useParams();
  const { state } = useLocation();
  const [space, setSpace] = useState(state?.space || null);
  const checkIn = state?.checkIn ?? '';
  const checkOut = state?.checkOut ?? '';
  const guests = state?.guests ?? 2;

  useEffect(() => {
    if (space) return; // state로 넘어온 경우 API 호출 불필요
    findSpaceByEntityNo(spaceId)
      .then(setSpace)
      .catch(() => setSpace(null));
  }, [spaceId]);

  if (!space) return null;

  const rooms = ROOM_DATA[spaceId] || DEFAULT_ROOMS;

  // 방 선택 → 공간 유형에 따라 상세 페이지로 이동
  const goDetail = (room) => {
    const path =
      space.type === 'OFFICE'
        ? `/coworking-offices/${spaceId}`
        : space.type === 'WORK_STAY'
          ? `/workstays/${spaceId}`
          : `/stations/${spaceId}`;
    navigate(path, { state: { selectedRoom: room, space, checkIn, checkOut, guests } });
  };

  return (
    <Layout>
      <MainHeader activePage="search" />
      <Content>
        <BackBtn onClick={() => navigate(-1)}>← 이전으로</BackBtn>

        {/* 공간 요약 */}
        <SpaceSummary>
          <SpaceThumb>{space.icon}</SpaceThumb>
          <div style={{ flex: 1 }}>
            <TypeTag>{space.type}</TypeTag>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 3 }}>
              {space.title}
            </div>
            <div style={{ fontSize: 13, color: COLOR.gray400 }}>
              📍 {space.location}
              <span style={{ marginLeft: 12 }}>
                ★ {space.score} ({space.reviewCount}개 리뷰)
              </span>
            </div>
          </div>
        </SpaceSummary>

        <SectionTitle>방 선택</SectionTitle>
        <SectionSub>원하는 방을 선택하고 예약을 진행하세요</SectionSub>

        <RoomGrid>
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              onClick={() => room.available && goDetail(room)}
              style={{
                opacity: room.available ? 1 : 0.6,
                cursor: room.available ? 'pointer' : 'not-allowed',
              }}
            >
              <RoomImg $color={room.color}>
                {room.icon}
                <AvailBadge $avail={room.available}>
                  {room.available ? '예약 가능' : '예약 마감'}
                </AvailBadge>
              </RoomImg>
              <RoomBody>
                <RoomName>{room.name}</RoomName>
                <RoomMeta>
                  <span>
                    👤 최대 {room.maxGuests}명 (기준 {room.baseGuests}명)
                  </span>
                </RoomMeta>
                <RoomAmenities>
                  {room.amenities.map((a, i) => (
                    <AmenityTag key={i}>{a}</AmenityTag>
                  ))}
                </RoomAmenities>
                <RoomPrice>
                  <Price>
                    {room.price.toLocaleString()}
                    <span> {room.priceUnit}</span>
                  </Price>
                  {room.available ? (
                    <SelectBtn
                      onClick={(e) => {
                        e.stopPropagation();
                        goDetail(room);
                      }}
                    >
                      선택
                    </SelectBtn>
                  ) : (
                    <span style={{ fontSize: 12, color: COLOR.gray400 }}>
                      마감
                    </span>
                  )}
                </RoomPrice>
              </RoomBody>
            </RoomCard>
          ))}
        </RoomGrid>
      </Content>
    </Layout>
  );
}

export default RoomListPage;
