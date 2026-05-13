import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import ReviewItem from './ReviewItem';
import { COLOR } from '../../../../rsvn/components/user/RsvnStyled';

const TABS = ['공간 정보', '편의시설', '리뷰', '위치·주변'];

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

const Actions = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
`;

const ActionBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #e8dfd0;
  background: #fff;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  &:hover {
    background: #eef5ee;
    border-color: #84a98c;
  }
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

// ── 컴포넌트 ──────────────────────────────────────────────
// space props 키 통일:
//   type, title, score, reviewCount, location
//   description, infoItems[{label,value}], notices[{title,desc}]
//   facilities[{icon,name}]
// wished, onWishToggle: 찜 토글
// reviews: 리뷰 배열

function DetailMainBox({
  space = {},
  reviews = [],
  wished = false,
  onWishToggle,
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [isWished, setIsWished] = useState(wished);

  const handleWish = () => {
    const next = !isWished;
    setIsWished(next);
    onWishToggle && onWishToggle(next);
  };

  const {
    type = '숙소',
    title = '공간명',
    score = 0,
    reviewCount = 0,
    location = '지역',
    description = '',
    infoItems = [],
    notices = [],
    facilities = [],
  } = space;

  return (
    <Wrap>
      <TypeBadge>{type}</TypeBadge>

      <TitleRow>
        <Title>{title}</Title>
        <Actions>
          <ActionBtn
            title="찜하기"
            onClick={handleWish}
            style={{
              color: isWished ? '#E65100' : '#aaa',
              borderColor: isWished ? '#E65100' : '#E8DFD0',
              background: isWished ? '#FFF3E0' : '#fff',
            }}
          >
            {isWished ? '♥' : '♡'}
          </ActionBtn>
        </Actions>
      </TitleRow>

      <Meta>
        <Score>★ {score}</Score>
        <span>({reviewCount} 리뷰)</span>
        <span>·</span>
        <span>📍 {location}</span>
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
          <Desc>{description || '공간 소개를 불러오는 중입니다.'}</Desc>

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
                    <div
                      style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}
                    >
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
          {facilities.length > 0 ? (
            <FacilityGrid>
              {facilities.map((f, i) => (
                <FacilityItem key={i}>
                  <span>{f.icon || '✓'}</span>
                  <span>{f.name}</span>
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
              {reviews.map((review) => (
                <ReviewItem key={review.id} review={review} />
              ))}
            </ReviewList>
          )}
        </TabContent>
      )}

      {/* ── 위치·주변 탭 ── */}
      {activeTab === 3 && (
        <TabContent>
          <SectionTitle>위치·주변</SectionTitle>
          <div style={{ color: COLOR.gray400, fontSize: 13 }}>
            카카오맵 연동 예정
          </div>
        </TabContent>
      )}
    </Wrap>
  );
}

export default DetailMainBox;
