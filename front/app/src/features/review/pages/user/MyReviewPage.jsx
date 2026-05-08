import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  TabBar,
  TabBtn,
  TabCount,
  PageTitle,
  PageSub,
  Card,
  CardRow,
  Thumb,
  CardBody,
  TagRow,
  CardTitle,
  CardMeta,
  COLOR,
} from '../../../rsvn/components/user/RsvnStyled';
import RsvnStatusBadge from '../../../rsvn/components/user/RsvnStatusBadge';

const TABS = [
  { label: '작성 가능', count: 2 },
  { label: '작성 완료', count: 3 },
];

const DUMMY_AVAILABLE = [
  {
    id: 1,
    type: '워크앤스테이',
    dday: 'D-25',
    title: '청평 숲속 파인뷰 스테이',
    date: '이용일 · 2026.04.18',
    icon: '🌲',
  },
  {
    id: 2,
    type: '코워킹오피스',
    dday: 'D-9',
    title: '강릉 바다향 커먼워크',
    date: '이용일 · 2026.04.02',
    icon: '🌊',
  },
];

const NoticeBanner = styled.div`
  background: #fffbf0;
  border: 1px solid #ffe4a0;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 12px;
  color: #666;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const WriteBadge = styled.span`
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 4px;
  background: #fff3e0;
  color: ${COLOR.orange};
`;

const WriteBtn = styled.button`
  background: ${COLOR.green};
  color: #fff;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 4px;
  &:hover {
    background: #1a3a2a;
  }
`;

function MyReviewPage() {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  return (
    <div>
      <PageTitle>내 리뷰</PageTitle>
      <PageSub>이용한 공간에 리뷰를 작성하고 관리하세요</PageSub>

      <TabBar>
        {TABS.map((tab, idx) => (
          <TabBtn
            key={idx}
            $active={activeTab === idx}
            onClick={() => setActiveTab(idx)}
          >
            {tab.label}
            <TabCount $active={activeTab === idx}>{tab.count}</TabCount>
          </TabBtn>
        ))}
      </TabBar>

      <NoticeBanner>
        💡 리뷰는 이용 완료 후 30일 이내에 작성 가능해요
      </NoticeBanner>

      {DUMMY_AVAILABLE.map((item) => (
        <Card key={item.id} style={{ cursor: 'default' }}>
          <CardRow>
            <Thumb>{item.icon}</Thumb>
            <CardBody>
              <TagRow>
                <RsvnStatusBadge type="type" label={item.type} />
                <WriteBadge>{item.dday}</WriteBadge>
              </TagRow>
              <CardTitle>{item.title}</CardTitle>
              <CardMeta>
                <span>{item.date}</span>
              </CardMeta>
            </CardBody>
            <WriteBtn onClick={() => navigate('/user/review/write')}>
              ⭐ 리뷰 작성
            </WriteBtn>
          </CardRow>
        </Card>
      ))}
    </div>
  );
}

export default MyReviewPage;
