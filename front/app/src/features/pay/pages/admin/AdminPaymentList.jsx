import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import { Button, EmptyState, Pagination } from '../../../pay_shared/components';
import { SettlementStatCard } from '../../../settlement/components/host/SettlementStatCard';
import { PaymentFilterBar } from '../../components/user/PaymentFilterBar';
import { PaymentListItem } from '../../components/user/PaymentListItem';
import { findPayAll, findPayStats } from '../../api/payApi';

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-3);
  margin-bottom: var(--space-5);

  @media (max-width: 960px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-5);
`;

const STATUS_TO_UI = {
  READY: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELED: 'refunded',
};

const METHOD_INFO = {
  KAKAOPAY: { label: '카카오페이', icon: '💛' },
  TOSSPAY: { label: '토스페이', icon: '💙' },
  NAVERPAY: { label: '네이버페이', icon: '💚' },
};

const TABS = [
  { value: 'all', label: '전체' },
  { value: 'completed', label: '결제 완료' },
  { value: 'refunded', label: '환불' },
  { value: 'failed', label: '결제 실패' },
];

const formatPaidAt = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

const toPaymentForUI = (resDto) => {
  const methodInfo = METHOD_INFO[resDto.method] ?? {
    label: resDto.method,
    icon: '💳',
  };
  return {
    no: resDto.no,
    id: `PAY-${String(resDto.no).padStart(6, '0')}`,
    status: STATUS_TO_UI[resDto.status] ?? 'pending',
    method: methodInfo.label,
    methodIcon: methodInfo.icon,
    emoji: '🏠',
    space: `예약 #${resDto.rsvnNo}`,
    paidAt: formatPaidAt(resDto.approvedAt ?? resDto.createdAt),
    amount: resDto.finalAmt ?? 0,
  };
};

export default function AdminPaymentList() {
  const navigate = useNavigate();

  const [content, setContent] = useState([]); // 현재 페이지 결제 목록(서버가 잘라서 줌)
  const [totalPages, setTotalPages] = useState(1); // 서버가 알려준 전체 페이지 수
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    completedAmt: 0,
    refunded: 0,
    failed: 0,
  });
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [page, setPage] = useState(1); // UI는 1-base, 서버는 0-base

  // 목록 — page/탭/기간 중 하나라도 바뀌면 서버에 재요청 (클라가 전체를 들고 있지 않음)
  useEffect(() => {
    const load = async () => {
      try {
        const data = await findPayAll(page - 1, selectedTab, selectedPeriod);
        setContent(data.content ?? []);
        setTotalPages(data.totalPages ?? 1);
      } catch (err) {
        console.error('관리자 결제 목록 조회 실패', err);
      }
    };
    load();
  }, [page, selectedTab, selectedPeriod]);

  // 통계 — 기간만 의존(탭과 무관하게 항상 전체 상태별 집계라 카드 4개가 정확)
  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await findPayStats(selectedPeriod);
        setStats(data);
      } catch (err) {
        console.error('결제 통계 조회 실패', err);
      }
    };
    loadStats();
  }, [selectedPeriod]);

  // 탭/기간 바꾸면 1페이지로 리셋(안 하면 5페이지에서 탭 바꿔 빈 결과 뜨는 버그)
  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setPage(1);
  };
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    setPage(1);
  };

  const tabsWithCount = useMemo(() => {
    const counts = {
      all: stats.total,
      completed: stats.completed,
      refunded: stats.refunded,
      failed: stats.failed,
    };
    return TABS.map((t) => ({ ...t, count: counts[t.value] }));
  }, [stats]);

  // 서버가 이미 필터·페이징한 결과라 클라에선 화면용 변환만
  const pageItems = useMemo(() => content.map(toPaymentForUI), [content]);

  const handleItemClick = (payment) => {
    navigate(`/admin/payment/${payment.no}`);
  };

  const handleReceiptClick = (payment) => {
    alert(
      `영수증 — PAY ${payment.no}\n관리자용 영수증 발급 기능은 통합 단계 진입 예정입니다.`
    );
  };

  const handleReset = () => {
    setSelectedTab('all');
    setSelectedPeriod('month');
    setPage(1);
  };

  return (
    <PageLayout
      title="결제 관리"
      description="모든 결제 내역을 모니터링하세요"
      maxWidth={1200}
    >
      <StatGrid>
        <SettlementStatCard
          icon="📊"
          label="총 결제 건수"
          value={stats.total.toLocaleString()}
          unit="건"
          subText="누적"
        />
        <SettlementStatCard
          icon="✓"
          label="결제 완료"
          value={stats.completed.toLocaleString()}
          unit="건"
          subText={`${stats.completedAmt.toLocaleString()}원`}
        />
        <SettlementStatCard
          icon="↩"
          label="환불"
          value={stats.refunded.toLocaleString()}
          unit="건"
          subText="취소된 결제"
          highlight={stats.refunded > 0}
        />
        <SettlementStatCard
          icon="⚠️"
          label="결제 실패"
          value={stats.failed.toLocaleString()}
          unit="건"
          subText="실패 영역"
          highlight={stats.failed > 0}
        />
      </StatGrid>

      <PaymentFilterBar
        tabs={tabsWithCount}
        selectedTab={selectedTab}
        onTabChange={handleTabChange}
        selectedPeriod={selectedPeriod}
        onPeriodChange={handlePeriodChange}
      />

      {pageItems.length === 0 ? (
        <EmptyState
          icon="🧾"
          title="조회된 결제가 없어요"
          description="필터 조건을 변경하거나 다른 기간을 선택해보세요"
          action={
            <Button variant="secondary" onClick={handleReset}>
              필터 초기화
            </Button>
          }
        />
      ) : (
        <List>
          {pageItems.map((payment) => (
            <PaymentListItem
              key={payment.no}
              payment={payment}
              onClick={handleItemClick}
              onReceiptClick={handleReceiptClick}
            />
          ))}
        </List>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onChange={setPage}
      />
    </PageLayout>
  );
}
