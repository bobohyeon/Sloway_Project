import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  Badge,
  Button,
  Pagination,
  EmptyState,
  Tabs,
  Card,
} from '../../pay_shared/components';

// ─── Mock 데이터 (백엔드 연동 시 GET /api/inquiries?status=&page= 로 대체) ──
// 실무: 본인 문의만 조회 → JWT 토큰의 userId 기반으로 서버에서 필터링
const MOCK_INQUIRIES = Array.from({ length: 14 }, (_, i) => ({
  id: i + 1,
  title: [
    '예약 취소 후 환불이 아직 안 됐어요',
    '결제가 두 번 된 것 같아요',
    '쿠폰이 적용이 안 돼요',
    '비밀번호 변경이 안 됩니다',
    '호스트와 채팅이 안 돼요',
  ][i % 5],
  category: ['예약·결제', '취소·환불', '계정', '서비스 이용', '기타'][i % 5],
  // answered: 답변 완료 / pending: 답변 대기 / processing: 처리 중
  status: ['answered', 'pending', 'processing'][i % 3],
  hasAnswer: i % 3 === 0,
  createdAt: `2026.0${(i % 5) + 1}.${String((i % 28) + 1).padStart(2, '0')}`,
  answeredAt:
    i % 3 === 0
      ? `2026.0${(i % 5) + 1}.${String((i % 28) + 3).padStart(2, '0')}`
      : null,
}));

const STATUS_MAP = {
  answered: { label: '답변 완료', variant: 'success' },
  pending: { label: '답변 대기', variant: 'muted' },
  processing: { label: '처리 중', variant: 'warning' },
};

const TAB_ITEMS = [
  { label: '전체', value: 'all', count: MOCK_INQUIRIES.length },
  {
    label: '답변 대기',
    value: 'pending',
    count: MOCK_INQUIRIES.filter((i) => i.status === 'pending').length,
  },
  {
    label: '처리 중',
    value: 'processing',
    count: MOCK_INQUIRIES.filter((i) => i.status === 'processing').length,
  },
  {
    label: '답변 완료',
    value: 'answered',
    count: MOCK_INQUIRIES.filter((i) => i.status === 'answered').length,
  },
];

const PAGE_SIZE = 10;

export default function InquiryListPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('all');
  const [page, setPage] = useState(1);

  const filtered = MOCK_INQUIRIES.filter(
    (i) => tab === 'all' || i.status === tab
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Wrap>
      {/* 헤더 */}
      <PageHeader>
        <div>
          <PageTitle>내 문의사항</PageTitle>
          <PageDesc>등록한 문의사항과 답변을 확인하세요.</PageDesc>
        </div>
        <Button onClick={() => navigate('/user/inquiry/form')}>
          + 문의하기
        </Button>
      </PageHeader>

      {/* 탭 */}
      <TabWrap>
        <Tabs
          items={TAB_ITEMS}
          value={tab}
          onChange={(v) => {
            setTab(v);
            setPage(1);
          }}
        />
      </TabWrap>

      {/* 목록 */}
      <ListCard elevated>
        {paged.length === 0 ? (
          <EmptyState
            icon="💬"
            title="문의사항이 없습니다"
            description="궁금하신 점이 있다면 문의해 주세요."
            action={
              <Button onClick={() => navigate('/user/inquiry/form')}>
                문의하기
              </Button>
            }
          />
        ) : (
          paged.map((inquiry) => (
            <InquiryRow
              key={inquiry.id}
              onClick={() => navigate(`/user/inquiry/${inquiry.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === 'Enter' && navigate(`/user/inquiry/${inquiry.id}`)
              }
              aria-label={inquiry.title}
            >
              <RowMain>
                <TopRow>
                  <Badge size="sm" variant="muted">
                    {inquiry.category}
                  </Badge>
                  <Badge size="sm" variant={STATUS_MAP[inquiry.status].variant}>
                    {STATUS_MAP[inquiry.status].label}
                  </Badge>
                </TopRow>
                <InquiryTitle>{inquiry.title}</InquiryTitle>
                <BottomRow>
                  <DateText>등록일 {inquiry.createdAt}</DateText>
                  {inquiry.answeredAt && (
                    <DateText>답변일 {inquiry.answeredAt}</DateText>
                  )}
                </BottomRow>
              </RowMain>
              <ChevronIcon aria-hidden="true">›</ChevronIcon>
            </InquiryRow>
          ))
        )}
      </ListCard>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onChange={(p) => {
          setPage(p);
          window.scrollTo(0, 0);
        }}
      />
    </Wrap>
  );
}

// ─── Styled Components ───────────────────────────────────────────────────────

const Wrap = styled.div`
  padding: var(--space-6);
  max-width: 100%;
  @media (max-width: 768px) {
    padding: var(--space-4);
  }
`;

const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-6);

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const PageTitle = styled.h1`
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--gray-800);
  letter-spacing: -0.02em;
  margin-bottom: 4px;
`;

const PageDesc = styled.p`
  font-size: 0.88rem;
  color: var(--gray-400);
`;

const TabWrap = styled.div`
  margin-bottom: var(--space-4);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

const ListCard = styled(Card)`
  overflow: hidden;
  margin-bottom: var(--space-2);
`;

const InquiryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: 18px 20px;
  cursor: pointer;
  transition: background 140ms ease;

  &:not(:last-child) {
    border-bottom: 1px solid var(--gray-100);
  }

  &:hover {
    background: var(--gray-50, #fafaf9);
  }

  &:focus-visible {
    outline: 2px solid var(--sage);
    outline-offset: -2px;
  }
`;

const RowMain = styled.div`
  flex: 1;
  min-width: 0;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
`;

const InquiryTitle = styled.p`
  font-size: 0.92rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 6px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const BottomRow = styled.div`
  display: flex;
  gap: var(--space-4);
`;

const DateText = styled.span`
  font-size: 0.75rem;
  color: var(--gray-400);
`;

const ChevronIcon = styled.span`
  font-size: 1.4rem;
  color: var(--gray-300);
  flex-shrink: 0;
`;
