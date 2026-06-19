import { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import ReviewItem from './ReviewItem';
import { COLOR } from '../../../../rsvn/components/user/RsvnStyled';

const TABS = ['공간 정보', '편의시설', '리뷰', '위치·주변'];

const AVATAR_COLORS = ['#A8B89F', '#7B9EA8', '#8B7BA8', '#A87B6B', '#6B8B7B', '#8B9EA8'];

function toDateStr(dt) {
  if (!dt) return '';
  return String(dt).slice(0, 10).replace(/-/g, '.');
}

// 백엔드 ReviewResDto → ReviewItem이 기대하는 형태로 변환
function toReviewItem(dto) {
  return {
    id: dto.no,
    name: dto.memberName ?? '익명',
    avatar: (dto.memberName ?? '?')[0],
    avatarColor: AVATAR_COLORS[dto.no % AVATAR_COLORS.length],
    date: toDateStr(dto.createdAt),
    usedDate: toDateStr(dto.checkIn) || null,
    scores: [
      { label: '종합 만족도', val: dto.scoreTotal ?? 0 },
      { label: '업무 환경',  val: dto.scoreOffice ?? 0 },
      { label: '편의시설',   val: dto.scoreAmenity ?? 0 },
      { label: '집중도',     val: dto.scoreFocus ?? 0 },
    ].filter((s) => s.val > 0),
    text: dto.content ?? '',
    helpful: dto.helpfulCount ?? 0, // 백엔드 도움돼요 수 (없으면 0)
    imgs: dto.imageUrls ?? [], // 백엔드가 주는 이미지 URL 배열 그대로 전달 (없으면 빈 배열)
    reply: dto.replies?.[0]
      ? {
          hostName: '호스트',
          date: toDateStr(dto.replies[0].createdAt),
          text: dto.replies[0].content,
        }
      : null,
    space: dto.spaceName,
    spaceType: dto.spaceType,
  };
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Wrap = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  color: #1a1a1a;
`;

const TypeBadge = styled.span`
  display: inline-block;
  font-size: 11px;
  color: #4a4a4a;
  border: 1px solid #e8dfd0;
  border-radius: 4px;
  padding: 2px 8px;
  margin-bottom: 10px;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
`;

const Title = styled.h1`
  font-family: 'DM Serif Display', 'Noto Serif KR', serif;
  font-size: 26px;
  font-weight: 400;
  color: #0d2418;
  line-height: 1.3;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #4a4a4a;
  margin-bottom: 20px;
`;

const Score = styled.span`
  color: #c97d4c;
  font-weight: 600;
`;

const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid #e8dfd0;
`;

const TabBtn = styled.button`
  padding: 12px 16px;
  font-size: 13px;
  font-family: 'Noto Sans KR', sans-serif;
  color: ${({ $active }) => ($active ? '#1A3A2A' : '#8A8A8A')};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  background: none;
  border: none;
  border-bottom: 2px solid
    ${({ $active }) => ($active ? '#2D6A4F' : 'transparent')};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: -1px;
  transition: all 0.2s;
  &:hover {
    color: #2d6a4f;
  }
`;

const TabCount = styled.span`
  font-size: 11px;
  color: #8a8a8a;
`;

const TabContent = styled.div`
  animation: ${fadeIn} 0.2s ease;
  padding-top: 28px;
`;

const SectionTitle = styled.h2`
  font-family: 'DM Serif Display', serif;
  font-size: 18px;
  font-weight: 400;
  color: #0d2418;
  margin: 28px 0 14px;
  &:first-child {
    margin-top: 0;
  }
`;

const Desc = styled.p`
  font-size: 14px;
  line-height: 1.8;
  color: #4a4a4a;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 40px;
  background: ${COLOR.gray100};
  border-radius: 10px;
  padding: 16px 20px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoLabel = styled.span`
  font-size: 11px;
  color: #8a8a8a;
  letter-spacing: 0.04em;
`;

const InfoValue = styled.span`
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 500;
`;

const NoticeItem = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 14px 16px;
  background: #fff8f0;
  border-radius: 10px;
  border-left: 3px solid #c97d4c;
  margin-bottom: 10px;
`;

const NoticeBadge = styled.span`
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  background: #c97d4c;
  padding: 2px 7px;
  border-radius: 4px;
  white-space: nowrap;
  margin-top: 2px;
`;

const FacilityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
`;

const FacilityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #4a4a4a;
`;

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-top: 8px;
`;

const EmptyReview = styled.div`
  padding: 60px 20px;
  text-align: center;
  font-size: 14px;
  color: #888;
  background: #faf7f2;
  border-radius: 10px;
`;

// reviews: 리뷰 배열

function DetailMainBox({ space = {}, reviews = [] }) {
  const [activeTab, setActiveTab] = useState(0);

  // TODO: 지도 컨테이너 DOM 참조 (useRef 패턴 — MapPage.jsx 참고)
  const mapRef = useRef(null);

  const {
    type = '숙소',
    title = '공간명',
    score = 0,
    reviewCount = 0,
    address = '지역',
    content = '',
    infoItems = [],
    notices = [],
    amenities = [],
    latitude,
    longitude,
  } = space;

  useEffect(() => {
    if (activeTab !== 3) return;
    if (!mapRef.current) return;
    if (!latitude || !longitude) return;

    const center = new window.kakao.maps.LatLng(Number(latitude), Number(longitude));
    const map = new window.kakao.maps.Map(mapRef.current, { center, level: 4 });
    new window.kakao.maps.Marker({ position: center, map });
  }, [activeTab, latitude, longitude]);

  return (
    <Wrap>
      <TypeBadge>{type}</TypeBadge>

      <TitleRow>
        <Title>{title}</Title>
      </TitleRow>

      <Meta>
        <Score>★ {score}</Score>
        <span>({reviewCount} 리뷰)</span>
        <span>·</span>
        <span>📍 {address}</span>
      </Meta>

      <Tabs>
        {TABS.map((tab, idx) => (
          <TabBtn
            key={idx}
            $active={activeTab === idx}
            onClick={() => setActiveTab(idx)}
          >
            {tab}
            {tab === '리뷰' && reviewCount > 0 && (
              <TabCount>{reviewCount}</TabCount>
            )}
          </TabBtn>
        ))}
      </Tabs>

      {/* ── 공간 정보 탭 ── */}
      {activeTab === 0 && (
        <TabContent>
          <SectionTitle>공간 소개</SectionTitle>
          <Desc>{content || '공간 소개를 불러오는 중입니다.'}</Desc>

          {infoItems.length > 0 && (
            <>
              <SectionTitle>기본 정보</SectionTitle>
              <InfoGrid>
                {infoItems.map((item, i) => (
                  <InfoItem key={i}>
                    <InfoLabel>{item.label}</InfoLabel>
                    <InfoValue>{item.value}</InfoValue>
                  </InfoItem>
                ))}
              </InfoGrid>
            </>
          )}

          {notices.length > 0 && (
            <>
              <SectionTitle>공지사항</SectionTitle>
              {notices.map((n, i) => (
                <NoticeItem key={i}>
                  <NoticeBadge>공지</NoticeBadge>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>
                      {n.title}
                    </div>
                    <div style={{ fontSize: 12, color: '#666' }}>{n.desc}</div>
                  </div>
                </NoticeItem>
              ))}
            </>
          )}
        </TabContent>
      )}

      {/* ── 편의시설 탭 ── */}
      {activeTab === 1 && (
        <TabContent>
          <SectionTitle>편의시설</SectionTitle>
          {amenities.length > 0 ? (
            <FacilityGrid>
              {amenities.map((amenity, i) => (
                <FacilityItem key={i}>
                  <span>✓</span>
                  <span>{amenity}</span>
                </FacilityItem>
              ))}
            </FacilityGrid>
          ) : (
            <EmptyReview>편의시설 정보가 없어요</EmptyReview>
          )}
        </TabContent>
      )}

      {/* ── 리뷰 탭 ── */}
      {activeTab === 2 && (
        <TabContent>
          <SectionTitle>리뷰 ({reviewCount})</SectionTitle>
          {reviews.length === 0 ? (
            <EmptyReview>아직 작성된 리뷰가 없어요</EmptyReview>
          ) : (
            <ReviewList>
              {reviews.map((dto) => {
                const review = toReviewItem(dto);
                return <ReviewItem key={review.id} review={review} />;
              })}
            </ReviewList>
          )}
        </TabContent>
      )}

      {/* ── 위치·주변 탭 ── */}
      {activeTab === 3 && (
        <TabContent>
          <SectionTitle>위치·주변</SectionTitle>
          <div style={{ fontSize: 13, color: COLOR.gray400, marginBottom: 10 }}>
            📍 {address}
          </div>
          {/* TODO: 지도 컨테이너 — useEffect에서 mapRef.current에 카카오맵 렌더링 */}
          {/*       width: 100%, height: 360px 정도. borderRadius: 12px */}
          <div
            ref={mapRef}
            style={{ width: '100%', height: 360, borderRadius: 12, background: COLOR.gray100 }}
          />
        </TabContent>
      )}
    </Wrap>
  );
}

export default DetailMainBox;
