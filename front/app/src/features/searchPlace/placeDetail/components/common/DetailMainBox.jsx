import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { COLOR } from '../../../../rsvn/components/user/RsvnStyled';
import ReviewList from './ReviewList';

const TABS = ['공간 정보', '편의시설', '리뷰', '위치·주변'];

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
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
  margin-bottom: 8px;
`;

const Title = styled.h1`
  font-family: 'DM Serif Display', serif;
  font-size: 26px;
  font-weight: 400;
  color: ${COLOR.black};
  line-height: 1.3;
`;

const ActionBtns = styled.div`
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
    background: ${COLOR.greenLight};
    border-color: ${COLOR.sage};
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

const Divider = styled.div`
  height: 1px;
  background: #e8dfd0;
  margin-bottom: 0;
`;

const TabBar = styled.div`
  display: flex;
  border-bottom: 1px solid ${COLOR.gray200};
`;

const TabBtn = styled.button`
  padding: 12px 16px;
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
  color: ${({ $active }) => ($active ? COLOR.black : '#AAAAAA')};
  background: none;
  border: none;
  border-bottom: 2.5px solid
    ${({ $active }) => ($active ? COLOR.green : 'transparent')};
  margin-bottom: -1px;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
`;

const TabCount = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  font-size: 10px;
  font-weight: 700;
  background: ${({ $active }) => ($active ? COLOR.green : '#DDD')};
  color: ${({ $active }) => ($active ? '#fff' : '#999')};
`;

const TabContent = styled.div`
  animation: ${fadeIn} 0.2s ease;
  padding-top: 24px;
`;

const SectionTitle = styled.h2`
  font-family: 'DM Serif Display', serif;
  font-size: 18px;
  font-weight: 400;
  color: ${COLOR.black};
  margin: 24px 0 12px;
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
`;

const InfoValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${COLOR.black};
`;

const NoticeItem = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 14px 16px;
  background: #fff8f0;
  border-radius: 10px;
  border-left: 3px solid ${COLOR.terra};
  margin-bottom: 8px;
`;

const NoticeBadge = styled.span`
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  background: ${COLOR.terra};
  padding: 2px 7px;
  border-radius: 4px;
  white-space: nowrap;
  margin-top: 2px;
`;

// space: { type, title, score, reviewCount, location, description, infoItems, notices }
function DetailMainBox({ space = {} }) {
  const [activeTab, setActiveTab] = useState(0);

  const {
    type = '숙소',
    title = '공간명',
    score = 0,
    reviewCount = 0,
    location = '지역',
    description = '',
    infoItems = [],
    notices = [],
  } = space;

  return (
    <div>
      <TypeBadge>{type}</TypeBadge>

      <TitleRow>
        <Title>{title}</Title>
        <ActionBtns>
          <ActionBtn title="찜하기">♡</ActionBtn>
          <ActionBtn title="공유">↗</ActionBtn>
        </ActionBtns>
      </TitleRow>

      <Meta>
        <span style={{ color: COLOR.terra, fontWeight: 600 }}>★ {score}</span>
        <span>({reviewCount} 리뷰)</span>
        <span style={{ color: '#ccc' }}>·</span>
        <span>📍 {location}</span>
      </Meta>

      <TabBar>
        {TABS.map((tab, idx) => (
          <TabBtn
            key={idx}
            $active={activeTab === idx}
            onClick={() => setActiveTab(idx)}
          >
            {tab}
            {tab === '리뷰' && reviewCount > 0 && (
              <TabCount $active={activeTab === idx}>{reviewCount}</TabCount>
            )}
          </TabBtn>
        ))}
      </TabBar>

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

      {activeTab === 1 && (
        <TabContent>
          <SectionTitle>편의시설</SectionTitle>
          <div style={{ color: COLOR.gray400, fontSize: 13 }}>
            백엔드 연결 후 표시 예정
          </div>
        </TabContent>
      )}

      {activeTab === 2 && (
        <TabContent>
          <ReviewList reviewCount={reviewCount} avgScore={score} />
        </TabContent>
      )}

      {activeTab === 3 && (
        <TabContent>
          <SectionTitle>위치·주변</SectionTitle>
          <div style={{ color: COLOR.gray400, fontSize: 13 }}>
            카카오맵 연동 예정
          </div>
        </TabContent>
      )}
    </div>
  );
}

export default DetailMainBox;
