// 관리자 결제 목록 페이지 — 도메인: Pay / 역할: ADMIN
// 백엔드 API: ✅ GET /api/payment/pay (전체 조회, 기존 종결)
// 관리자 영역 — 회원 검증 없음, 모든 결제 노출

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { Button, EmptyState, Pagination } from '../../../pay_shared/components';
import { SettlementStatCard } from '../../../settlement/components/host/SettlementStatCard';
import { PaymentFilterBar } from '../../components/user/PaymentFilterBar';
import { PaymentListItem } from '../../components/user/PaymentListItem';

import { findPayAll } from '../../api/payApi';

const PAGE_SIZE = 10;

// 백엔드 PayStatus → UI 키 (PaymentStatusBadge interface)
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

const periodToCutoffMs = (period) => {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  if (period === 'month') return now - 30 * day;
  if (period === '3months') return now - 90 * day;
  if (period === '6months') return now - 180 * day;
  if (period === 'year') return now - 365 * day;
  return 0;
};

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
    emoji: '🏠', // 예약 도메인 미연동
    space: `예약 #${resDto.rsvnNo}`,
    paidAt: formatPaidAt(resDto.approvedAt ?? resDto.createdAt),
    amount: resDto.finalAmt ?? 0,
  };
};

export default function AdminPaymentList() {
  const navigate = useNavigate();

  const [pays, setPays] = useState([]);
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const load = async () => {
      try {
        const list = await findPayAll();
        setPays(list);
      } catch (err) {
        console.error('관리자 결제 목록 조회 실패', err);
      }
    };
    load();
  }, []);

  // 통계 — 전체 기간 기준 (탭/기간 필터와 분리, 관리자는 누적 수치 우선)
  const stats = useMemo(() => {
    const s = {
      total: pays.length,
      completed: 0,
      refunded: 0,
      failed: 0,
      totalAmt: 0,
    };
    pays.forEach((p) => {
      const uiStatus = STATUS_TO_UI[p.status];
      if (uiStatus === 'completed') {
        s.completed += 1;
        s.totalAmt += p.finalAmt ?? 0;
      }
      if (uiStatus === 'refunded') s.refunded += 1;
      if (uiStatus === 'failed') s.failed += 1;
    });
    return s;
  }, [pays]);

  // 탭 별 개수 (전체 기간 기준)
  const tabsWithCount = useMemo(() => {
    const counts = {
      all: pays.length,
      completed: stats.completed,
      refunded: stats.refunded,
      failed: stats.failed,
    };
    return TABS.map((t) => ({ ...t, count: counts[t.value] }));
  }, [pays, stats]);

  // 탭 + 기간 필터 + 변환
  const filtered = useMemo(() => {
    const cutoff = periodToCutoffMs(selectedPeriod);
    return pays
      .filter((p) => {
        const uiStatus = STATUS_TO_UI[p.status];
        if (selectedTab !== 'all' && uiStatus !== selectedTab) return false;
        if (cutoff > 0) {
          const created = new Date(p.createdAt).getTime();
          if (created < cutoff) return false;
        }
        return true;
      })
      .map(toPaymentForUI);
  }, [pays, selectedTab, selectedPeriod]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
          subText={`${stats.totalAmt.toLocaleString()}원`}
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
        onTabChange={setSelectedTab}
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
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
