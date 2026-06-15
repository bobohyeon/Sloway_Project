import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { findRoomsByPlaceNo } from '../../../api/searchApi';
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
  overflow: hidden;
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

const EmptyBox = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px 0;
  color: ${COLOR.gray400};
  font-size: 14px;
`;

const TYPE_ICON = { WORK_STAY: '🌿', OFFICE: '💻', STATION: '🛌' };
const TYPE_COLOR = { WORK_STAY: '#D8E8D0', OFFICE: '#D0E0E8', STATION: '#E8E0D0' };

function RoomListPage() {
  const navigate = useNavigate();
  const { spaceId } = useParams(); // placeNo
  const { state } = useLocation();
  // 검색 결과 카드 데이터 — 요약 표시용 (title, type, location, score, thumbnailUrl)
  const spaceInfo = state?.space ?? null;
  const checkIn = state?.checkIn ?? '';
  const checkOut = state?.checkOut ?? '';
  const guests = state?.guests ?? 2;

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const type = spaceInfo?.type;
    if (!type) return;
    setLoading(true);
    findRoomsByPlaceNo(spaceId, type)
      .then(setRooms)
      .catch(() => setRooms([]))
      .finally(() => setLoading(false));
  }, [spaceId]);

  if (!spaceInfo) return null;

  // 방 선택 → entityNo(실제 방 PK)로 상세 페이지 이동
  const goDetail = (room) => {
    const path =
      room.type === 'OFFICE'
        ? `/coworking-offices/${room.entityNo}`
        : room.type === 'WORK_STAY'
          ? `/workstays/${room.entityNo}`
          : `/stations/${room.entityNo}`;
    navigate(path, { state: { selectedRoom: room, space: spaceInfo, checkIn, checkOut, guests } });
  };

  return (
    <Layout>
      <MainHeader activePage="search" />
      <Content>
        <BackBtn onClick={() => navigate(-1)}>← 이전으로</BackBtn>

        {/* 공간 요약 — 검색 결과 카드(spaceInfo) 데이터 사용 */}
        <SpaceSummary>
          <SpaceThumb>
            {spaceInfo.thumbnailUrl
              ? <img src={spaceInfo.thumbnailUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : (TYPE_ICON[spaceInfo.type] ?? '🏠')
            }
          </SpaceThumb>
          <div style={{ flex: 1 }}>
            <TypeTag>{spaceInfo.type}</TypeTag>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 3 }}>
              {spaceInfo.title}
            </div>
            <div style={{ fontSize: 13, color: COLOR.gray400 }}>
              📍 {spaceInfo.location}
              <span style={{ marginLeft: 12 }}>
                ★ {spaceInfo.score} ({spaceInfo.reviewCount}개 리뷰)
              </span>
            </div>
          </div>
        </SpaceSummary>

        <SectionTitle>방 선택</SectionTitle>
        <SectionSub>원하는 방을 선택하고 예약을 진행하세요</SectionSub>

        <RoomGrid>
          {loading ? (
            <EmptyBox>🔍 불러오는 중...</EmptyBox>
          ) : rooms.length === 0 ? (
            <EmptyBox>등록된 방이 없습니다.</EmptyBox>
          ) : (
            rooms.map((room) => {
              const available = true; // TODO: exceptionPeriods 기반 날짜 필터링
              const icon = TYPE_ICON[room.type] ?? '🏠';
              const color = TYPE_COLOR[room.type] ?? '#E8E0D0';
              const thumbnail = room.images?.[0] ?? null;
              const amenities = room.amenities ?? [];
              const priceUnit = room.type === 'OFFICE' ? '원/4시간' : '원/박';
              return (
                <RoomCard
                  key={room.entityNo}
                  onClick={() => available && goDetail(room)}
                  style={{
                    opacity: available ? 1 : 0.6,
                    cursor: available ? 'pointer' : 'not-allowed',
                  }}
                >
                  <RoomImg $color={color}>
                    {thumbnail
                      ? <img src={thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : icon
                    }
                    <AvailBadge $avail={available}>
                      {available ? '예약 가능' : '예약 마감'}
                    </AvailBadge>
                  </RoomImg>
                  <RoomBody>
                    <RoomName>{room.title}</RoomName>
                    <RoomMeta>
                      <span>👤 최대 {room.maxCnt}명 (기준 {room.baseCnt}명)</span>
                    </RoomMeta>
                    <RoomAmenities>
                      {amenities.map((a, i) => (
                        <AmenityTag key={i}>{a}</AmenityTag>
                      ))}
                    </RoomAmenities>
                    <RoomPrice>
                      <Price>
                        {(room.basePrice ?? 0).toLocaleString()}
                        <span> {priceUnit}</span>
                      </Price>
                      {available ? (
                        <SelectBtn
                          onClick={(e) => {
                            e.stopPropagation();
                            goDetail(room);
                          }}
                        >
                          선택
                        </SelectBtn>
                      ) : (
                        <span style={{ fontSize: 12, color: COLOR.gray400 }}>마감</span>
                      )}
                    </RoomPrice>
                  </RoomBody>
                </RoomCard>
              );
            })
          )}
        </RoomGrid>
      </Content>
    </Layout>
  );
}

export default RoomListPage;
