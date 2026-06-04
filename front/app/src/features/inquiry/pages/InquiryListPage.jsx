import { useState, useEffect, useCallback } from 'react';
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
import PageLayout from '../../../app/layouts/page/PageLayout';
import api from '../../../app/api/axiosApi';
import { useAuth } from '../../auth/hooks/useAuth';

const CATEGORY_LABEL = {
  RESERVATION: '예약',
  PAYMENT: '결제',
  PLACE: '공간',
  OTHER: '기타',
};

const STATUS_CONFIG = {
  ANSWERED: { label: '답변 완료', variant: 'success' },
  PENDING: { label: '답변 대기', variant: 'muted' },
};

const TAB_ITEMS = [
  { label: '전체', value: '' },
  { label: '답변 대기', value: 'PENDING' },
  { label: '답변 완료', value: 'ANSWERED' },
];

const fmtDate = (iso) => (iso ? iso.slice(0, 10).replace(/-/g, '.') : '');

export default function InquiryListPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('');
  const [page, setPage] = useState(1);
  const [inquiries, setInquiries] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const { user, role } = useAuth();

  const fetchInquiries = useCallback(async () => {
    const { data } = await api.get('/inquiry/my', {
      params: {
        page: page - 1,
        size: 10,
        sort: 'createdAt,DESC',
        status: tab || undefined,
      },
    });
    setInquiries(data.content);
    setTotalPages(data.totalPages);
  }, [tab, page]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  return (
    <PageLayout
      title="내 문의사항"
      description="등록한 문의사항과 답변을 확인하세요"
      actions={
        <Button
          onClick={() => {
            const path =
              user?.role === 'U' ? '/user/inquiry/form' : '/host/inquiry/form';
            navigate(path);
          }}
        >
          + 문의하기
        </Button>
      }
    >
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
        {inquiries.length === 0 ? (
          <EmptyState
            icon="💬"
            title="문의사항이 없습니다"
            description="궁금하신 점이 있다면 문의해 주세요."
            action={
              <Button
                onClick={() => {
                  const path =
                    user?.role === 'U'
                      ? '/user/inquiry/form'
                      : '/host/inquiry/form';
                  navigate(path);
                }}
              >
                문의하기
              </Button>
            }
          />
        ) : (
          inquiries.map((inquiry) => {
            const st = STATUS_CONFIG[inquiry.status] ?? {
              label: inquiry.status,
              variant: 'muted',
            };
            return (
              <InquiryRow
                key={inquiry.id}
                onClick={() => {
                  const path =
                    user?.role === 'U'
                      ? `/user/inquiry/${inquiry.id}`
                      : `/host/inquiry/${inquiry.id}`;
                  navigate(path);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const path =
                      user?.role === 'U'
                        ? `/user/inquiry/${inquiry.id}`
                        : `/host/inquiry/${inquiry.id}`;
                    navigate(path);
                  }
                }}
                aria-label={inquiry.title}
              >
                <RowMain>
                  <TopRow>
                    <Badge size="sm" variant="muted">
                      {CATEGORY_LABEL[inquiry.category] ?? inquiry.category}
                    </Badge>
                    <Badge size="sm" variant={st.variant}>
                      {st.label}
                    </Badge>
                  </TopRow>
                  <InquiryTitle>{inquiry.title}</InquiryTitle>
                  <BottomRow>
                    <DateText>등록일 {fmtDate(inquiry.createdAt)}</DateText>
                    {inquiry.answeredAt && (
                      <DateText>답변일 {fmtDate(inquiry.answeredAt)}</DateText>
                    )}
                  </BottomRow>
                </RowMain>
                <ChevronIcon aria-hidden="true">›</ChevronIcon>
              </InquiryRow>
            );
          })
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
    </PageLayout>
  );
}

// ─── Styled Components ───────────────────────────────────────────────────────

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
