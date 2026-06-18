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
import { findReviewable } from '../../../rsvn/api/rsvnApi';
import { Pagination } from '../../../pay_shared/components/Pagination';

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

// spaceType(enum) → 한글 라벨 / 아이콘
const TYPE_LABEL = { WORK_STAY: '워크앤스테이', OFFICE: '오피스', STATION: '숙소' };
const TYPE_ICON  = { WORK_STAY: '🌲', OFFICE: '💻', STATION: '🛌' };

// checkOut 기준 +14일 마감까지 남은 일수 → 'D-N'
function calcDday(checkOut) {
  const deadline = new Date(checkOut);
  deadline.setDate(deadline.getDate() + 14);
  const diff = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));
  return `D-${diff}`;
}

const PAGE_SIZE = 10;

function MyReviewPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [myReviews, setMyReviews] = useState([]);
  const [reviewable, setReviewable] = useState([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [reviews, available] = await Promise.all([
          findMyReviews(),
          findReviewable(),
        ]);
        setMyReviews(reviews);
        setReviewable(available);
      } catch {
        setMyReviews([]);
        setReviewable([]);
      }
    };
    fetchAll();
  }, []);

  const TABS = [
    { label: '작성 가능', count: reviewable.length },
    { label: '작성 완료', count: myReviews.length },
  ];

  const totalPages = Math.ceil(myReviews.length / PAGE_SIZE);
  const pagedReviews = myReviews.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const formatDate = (dt) => dt?.slice(0, 10).replaceAll('-', '.') ?? '';

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
            onClick={() => { setActiveTab(idx); setPage(1); }}
          >
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
          {reviewable.map((item) => (
            <Card key={item.no} style={{ cursor: 'default' }}>
              <CardRow>
                <Thumb>{TYPE_ICON[item.spaceType] ?? '🏠'}</Thumb>
                <CardBody>
                  <TagRow>
                    <RsvnStatusBadge type="type" label={TYPE_LABEL[item.spaceType] ?? item.spaceType} />
                    <WriteBadge>{calcDday(item.checkOut)}</WriteBadge>
                  </TagRow>
                  <CardTitle>{item.spaceName}</CardTitle>
                  <CardMeta>
                    <span>이용일 · {formatDate(item.checkOut)}</span>
                  </CardMeta>
                </CardBody>
                <WriteBtn
                  onClick={() =>
                    navigate('/user/review/write', {
                      state: { rsvnNo: item.no },
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
          {myReviews.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 0',
                color: COLOR.gray400,
                fontSize: 14,
              }}
            >
              작성한 리뷰가 없어요
            </div>
          )}
          {pagedReviews.map((item) => (
            <Card key={item.no} onClick={() => navigate(`/review/${item.no}`)}>
              <CardRow>
                <Thumb>📝</Thumb>
                <CardBody>
                  <TagRow>
                    <RsvnStatusBadge
                      type="type"
                      label={item.spaceType ?? '공간'}
                    />
                    <Stars>
                      {'★'.repeat(item.scoreTotal)}
                      {'☆'.repeat(5 - item.scoreTotal)}
                    </Stars>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#C97D4C',
                      }}
                    >
                      {item.scoreTotal}.0
                    </span>
                  </TagRow>
                  <CardTitle>{item.spaceName}</CardTitle>
                  <CardMeta>
                    <span>
                      이용일 · {formatDate(item.checkIn)} ~{' '}
                      {formatDate(item.checkOut)}
                    </span>
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
                    {item.content}
                  </div>
                </CardBody>
              </CardRow>
            </Card>
          ))}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onChange={(p) => { setPage(p); window.scrollTo(0, 0); }}
          />
        </>
      )}
    </PageLayout>
  );
}

export default MyReviewPage;
