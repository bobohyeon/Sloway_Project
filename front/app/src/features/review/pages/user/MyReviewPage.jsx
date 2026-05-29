import { useState, useEffect } from 'react';
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
import { findMyReviews } from '../../api/reviewApi';

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
  &:hover { background: #1a3a2a; }
`;

const Stars = styled.span`
  color: #c97d4c;
  font-size: 13px;
`;

// 작성 가능 더미 — 추후 예약 도메인 API 연동 시 교체
const DUMMY_AVAILABLE = [
  { id: 1, type: '워크앤스테이', dday: 'D-25', title: '청평 숲속 파인뷰 스테이', date: '이용일 · 2026.04.18', icon: '🌲' },
  { id: 2, type: '오피스', dday: 'D-9', title: '강릉 바다향 커먼워크', date: '이용일 · 2026.04.02', icon: '🌊' },
];

function MyReviewPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [myReviews, setMyReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyReviews = async () => {
      try {
        const data = await findMyReviews();
        setMyReviews(data);
      } catch {
        setMyReviews([]);
      }
    };
    fetchMyReviews();
  }, []);

  const TABS = [
    { label: '작성 가능', count: DUMMY_AVAILABLE.length },
    { label: '작성 완료', count: myReviews.length },
  ];

  const formatDate = (dt) => dt?.slice(0, 10).replaceAll('-', '.') ?? '';

  return (
    <PageLayout
      title="내 리뷰"
      description="이용한 공간에 리뷰를 작성하고 관리하세요"
      maxWidth={960}
    >
      <TabBar>
        {TABS.map((tab, idx) => (
          <TabBtn key={idx} $active={activeTab === idx} onClick={() => setActiveTab(idx)}>
            {tab.label}
            <TabCount $active={activeTab === idx}>{tab.count}</TabCount>
          </TabBtn>
        ))}
      </TabBar>

      {activeTab === 0 && (
        <>
          <NoticeBanner>
            💡 리뷰는 이용 완료 후 14일 이내에 작성 가능해요
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
                  <CardMeta><span>{item.date}</span></CardMeta>
                </CardBody>
                <WriteBtn
                  onClick={() => navigate('/user/review/write', { state: { rsvnNo: item.id } })}
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
          {myReviews.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: COLOR.gray400, fontSize: 14 }}>
              작성한 리뷰가 없어요
            </div>
          )}
          {myReviews.map((item) => (
            <Card key={item.no} onClick={() => navigate(`/review/${item.no}`)}>
              <CardRow>
                <Thumb>📝</Thumb>
                <CardBody>
                  <TagRow>
                    <RsvnStatusBadge type="type" label={item.spaceType ?? '공간'} />
                    <Stars>{'★'.repeat(item.scoreTotal)}{'☆'.repeat(5 - item.scoreTotal)}</Stars>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#C97D4C' }}>
                      {item.scoreTotal}.0
                    </span>
                  </TagRow>
                  <CardTitle>{item.spaceName}</CardTitle>
                  <CardMeta>
                    <span>이용일 · {formatDate(item.checkIn)} ~ {formatDate(item.checkOut)}</span>
                  </CardMeta>
                  <div style={{ fontSize: 13, color: '#555', marginTop: 6, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    {item.content}
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
