import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import {
  TabBar,
  TabBtn,
  TabCount,Card,
  CardRow,
  Thumb,
  CardBody,
  TagRow,
  CardTitle,
  CardMeta,
  CardRight,
  Pagination,
  PageBtn,
  COLOR,
} from '../../../rsvn/components/user/RsvnStyled';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const FilterRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 16px;
`;

const Select = styled.select`
  padding: 7px 12px;
  border: 1px solid ${COLOR.gray200};
  border-radius: 8px;
  font-size: 13px;
  background: #fff;
  outline: none;
`;

const SearchInput = styled.input`
  padding: 7px 12px;
  border: 1px solid ${COLOR.gray200};
  border-radius: 8px;
  font-size: 13px;
  outline: none;
  flex: 1;
  min-width: 160px;
  &:focus {
    border-color: ${COLOR.sage};
  }
`;

const SearchBtn = styled.button`
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

const StatusBadge = styled.span`
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  background: ${({ $status }) =>
    $status === 'PENDING'
      ? '#FFF3E0'
      : $status === 'KEPT'
        ? '#EEF5EE'
        : '#FFEBEB'};
  color: ${({ $status }) =>
    $status === 'PENDING'
      ? '#E65100'
      : $status === 'KEPT'
        ? '#2D6A4F'
        : '#C0392B'};
`;

const TABS = [
  { label: '전체', status: null },
  { label: '검토 중', status: 'PENDING' },
  { label: '유지', status: 'KEPT' },
  { label: '삭제됨', status: 'DELETED' },
];

const STATUS_LABEL = { PENDING: '검토 중', KEPT: '유지', DELETED: '삭제됨' };

const REASONS = [
  '욕설·비방',
  '허위 사실',
  '광고성',
  '개인정보',
  '무관한 내용',
  '기타',
];

const DUMMY = [
  {
    id: 1,
    status: 'PENDING',
    reason: '욕설·비방',
    reporter: '박민수',
    reviewer: '홍길동',
    space: '청평 숲속 파인뷰',
    reportDate: '2026.05.10',
    reviewText: '진짜 최악이야 다시는 안 와',
    icon: '🌲',
  },
  {
    id: 2,
    status: 'PENDING',
    reason: '허위 사실',
    reporter: '이지은',
    reviewer: '김수현',
    space: '성수 브릭라운지',
    reportDate: '2026.05.08',
    reviewText: '와이파이 아예 안 터짐 (실제로는 기가급)',
    icon: '🧱',
  },
  {
    id: 3,
    status: 'KEPT',
    reason: '광고성',
    reporter: '정유리',
    reviewer: '이강',
    space: '강릉 바다향 커먼워크',
    reportDate: '2026.04.28',
    reviewText: '다른 카페가 더 좋아요 (링크)',
    icon: '🌊',
  },
  {
    id: 4,
    status: 'DELETED',
    reason: '개인정보',
    reporter: '최준호',
    reviewer: '소영',
    space: '제주 돌담집 리트릿',
    reportDate: '2026.04.20',
    reviewText: '호스트 연락처는 xxx-xxxx-xxxx',
    icon: '🌴',
  },
  {
    id: 5,
    status: 'PENDING',
    reason: '무관한 내용',
    reporter: '한지수',
    reviewer: '민재',
    space: '청평 숲속 파인뷰',
    reportDate: '2026.05.12',
    reviewText: '오늘 날씨가 좋네요 ㅎㅎ',
    icon: '🌲',
  },
];

function AdminReviewPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [reasonFilter, setReasonFilter] = useState('전체 사유');
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);

  const counts = TABS.map((tab, idx) =>
    idx === 0
      ? DUMMY.length
      : DUMMY.filter((i) => i.status === tab.status).length
  );

  const filtered = DUMMY.filter(
    (i) => activeTab === 0 || i.status === TABS[activeTab].status
  )
    .filter((i) => reasonFilter === '전체 사유' || i.reason === reasonFilter)
    .filter(
      (i) =>
        !keyword || i.reporter.includes(keyword) || i.reviewer.includes(keyword)
    );

  return (
    <PageLayout
      title="리뷰 신고 관리"
      description="접수된 리뷰 신고를 검토하고 처리하세요"
      maxWidth={1200}
    >

      <TabBar>
        {TABS.map((tab, idx) => (
          <TabBtn
            key={idx}
            $active={activeTab === idx}
            onClick={() => setActiveTab(idx)}
          >
            {tab.label}
            <TabCount $active={activeTab === idx}>{counts[idx]}</TabCount>
          </TabBtn>
        ))}
      </TabBar>

      <FilterRow>
        <Select
          value={reasonFilter}
          onChange={(e) => setReasonFilter(e.target.value)}
        >
          <option>전체 사유</option>
          {REASONS.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </Select>
        <Select>
          <option>전체 기간</option>
          <option>이번 달</option>
          <option>지난 3개월</option>
        </Select>
        <SearchInput
          placeholder="신고자 · 작성자 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <SearchBtn onClick={() => setPage(1)}>검색</SearchBtn>
      </FilterRow>

      {filtered.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '40px 0',
            color: COLOR.gray400,
            fontSize: 14,
          }}
        >
          조건에 맞는 신고가 없어요
        </div>
      )}

      {filtered.map((item) => (
        <Card
          key={item.id}
          onClick={() => navigate(`/admin/review/report/${item.id}`)}
        >
          <CardRow>
            <Thumb>{item.icon}</Thumb>
            <CardBody>
              <TagRow>
                <StatusBadge $status={item.status}>
                  {STATUS_LABEL[item.status]}
                </StatusBadge>
                <span
                  style={{
                    fontSize: 11,
                    padding: '2px 7px',
                    borderRadius: 4,
                    background: '#F5F0E8',
                    color: '#666',
                  }}
                >
                  {item.reason}
                </span>
              </TagRow>
              <CardTitle style={{ marginTop: 4 }}>{item.space}</CardTitle>
              <CardMeta>
                <span>신고자: {item.reporter}</span>
                <span>·</span>
                <span>작성자: {item.reviewer}</span>
                <span>·</span>
                <span>{item.reportDate}</span>
              </CardMeta>
              <div
                style={{
                  fontSize: 12,
                  color: '#666',
                  marginTop: 6,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
              >
                "{item.reviewText}"
              </div>
            </CardBody>
            <CardRight>
              <span style={{ fontSize: 12, color: COLOR.green }}>상세 →</span>
            </CardRight>
          </CardRow>
        </Card>
      ))}

      {filtered.length > 0 && (
        <Pagination>
          <PageBtn onClick={() => setPage((p) => Math.max(1, p - 1))}>
            ‹
          </PageBtn>
          {[1, 2].map((p) => (
            <PageBtn key={p} $active={page === p} onClick={() => setPage(p)}>
              {p}
            </PageBtn>
          ))}
          <PageBtn onClick={() => setPage((p) => p + 1)}>›</PageBtn>
        </Pagination>
      )}
    </PageLayout>
  );
}

export default AdminReviewPage;
