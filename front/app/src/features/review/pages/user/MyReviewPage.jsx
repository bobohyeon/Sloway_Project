import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import {
  TabBar,
  TabBtn,
  TabCount,
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

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;
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

const Stars = styled.span`
  color: #c97d4c;
  font-size: 13px;
`;

// 작성 가능 더미
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
    type: '오피스',
    dday: 'D-9',
    title: '강릉 바다향 커먼워크',
    date: '이용일 · 2026.04.02',
    icon: '🌊',
  },
];

// 작성 완료 더미
const DUMMY_DONE = [
  {
    id: 3,
    type: '숙소',
    title: '제주 돌담집 리트릿',
    date: '이용일 · 2026.03.15',
    icon: '🌴',
    score: 5,
    text: '조용하고 몰입감 있어요. 다음에 또 오고 싶어요!',
    helpful: 24,
  },
  {
    id: 4,
    type: '워크앤스테이',
    title: '남해 올리브 팜스테이',
    date: '이용일 · 2026.02.20',
    icon: '✉️',
    score: 4,
    text: '전체적으로 좋았는데 주말에 사람이 좀 많아요.',
    helpful: 7,
  },
  {
    id: 5,
    type: '오피스',
    title: '성수 브릭라운지',
    date: '이용일 · 2026.01.10',
    icon: '🧱',
    score: 5,
    text: '와이파이 빠르고 의자도 편해서 하루종일 작업했어요.',
    helpful: 15,
  },
];

function MyReviewPage() {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  const TABS = [
    { label: '작성 가능', count: DUMMY_AVAILABLE.length },
    { label: '작성 완료', count: DUMMY_DONE.length },
  ];

  return (
    <PageLayout
      title="내 리뷰"
      description="이용한 공간에 리뷰를 작성하고 관리하세요"
      maxWidth={960}
    >
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

      {activeTab === 0 && (
        <>
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
                <WriteBtn
                  onClick={() =>
                    navigate('/user/review/write', {
                      state: { rsvnNo: item.id },
                    })
                  }
                >
                  ⭐ 리뷰 작성
                </WriteBtn>
              </CardRow>
            </Card>
          ))}
        </>
      )}

      {activeTab === 1 && (
        <>
          {DUMMY_DONE.map((item) => (
            <Card key={item.id} onClick={() => navigate(`/review/${item.id}`)}>
              <CardRow>
                <Thumb>{item.icon}</Thumb>
                <CardBody>
                  <TagRow>
                    <RsvnStatusBadge type="type" label={item.type} />
                    <Stars>{'★'.repeat(item.score)}</Stars>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#C97D4C',
                      }}
                    >
                      {item.score}.0
                    </span>
                  </TagRow>
                  <CardTitle>{item.title}</CardTitle>
                  <CardMeta>
                    <span>{item.date}</span>
                    <span>·</span>
                    <span>👍 도움돼요 {item.helpful}</span>
                  </CardMeta>
                  <div
                    style={{
                      fontSize: 13,
                      color: '#555',
                      marginTop: 6,
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.text}
                  </div>
                </CardBody>
              </CardRow>
            </Card>
          ))}
        </>
      )}
    </PageLayout>
  );
}

export default MyReviewPage;
