import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaHeart, FaRegHeart } from 'react-icons/fa'; // FaRegHeart 추가

// --- 기존 스타일 유지 및 ActionBtn 추가 ---
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const Card = styled.div`
  border: 1px solid #eee;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
const ImageBox = styled.div`
  position: relative;
  height: 180px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
`;

// 주신 ActionBtn 스타일 적용
const HeartBtn = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
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
  z-index: 2;

  /* 찜한 상태일 때의 스타일 */
  color: #e65100;
  border-color: #e65100;
  background: #fff3e0;

  &:hover {
    background: #ffeccf;
    border-color: #e65100;
  }
`;

const Content = styled.div`
  padding: 16px;
  /* ... 기존 컨텐츠 스타일 동일 ... */
`;

const WishCardComponent = ({ data, onToggleWish }) => {
  const navigate = useNavigate();

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
// reviews: 리뷰 배열

function DetailMainBox({ space = {}, reviews = [] }) {
  const [activeTab, setActiveTab] = useState(0);

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
  } = space;

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
              {reviews.map((review) => (
                <ReviewItem key={review.id} review={review} />
              ))}
            </ReviewList>
          )}
        </TabContent>
      )}
  const pathMap = {
    WORK_STAY: 'workstays',
    OFFICE: 'coworking-offices',
    STATION: 'stations',
  };

  return (
    <Grid>
      {data.map((item) => (
        <Card
          key={item.no}
          onClick={() =>
            navigate(`/${pathMap[item.type] || 'accommodations'}/${item.no}`)
          }
        >
          <ImageBox>
            {item.thumbnail ? (
              <img
                src={item.thumbnail}
                alt={item.placeTitle}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              '🏠'
            )}

            {/* 개선된 하트 버튼 */}
            <HeartBtn
              onClick={(e) => {
                e.stopPropagation();
                onToggleWish(item.no);
              }}
            >
              <FaHeart />
            </HeartBtn>
          </ImageBox>

          <Content>
            <div className="type-tag">{item.type}</div>
            <div className="title">{item.placeTitle}</div>
            <div className="info">📍 {item.address}</div>
            <div className="price-row">
              <span className="rating">⭐ {item.rating}</span>
              <span className="price">
                {item.price?.toLocaleString()}원
                <span className="unit">
                  {item.type === 'OFFICE' ? ' /시간' : ' /박'}
                </span>
              </span>
            </div>
          </Content>
        </Card>
      ))}
    </Grid>
  );
};

export default WishCardComponent;
