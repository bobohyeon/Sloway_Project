// 관리자 환불 관리 페이지 — 도메인: Refund / 역할: ADMIN
// 백엔드 API: ✅ GET /api/payment/refund (전체 환불 조회, 어제 종결)
// 의존: 회원·예약·공간 도메인 미연동 영역 — userName/spaceName/method placeholder

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { Button, EmptyState, Pagination } from '../../../pay_shared/components';
import { SettlementStatCard } from '../../../settlement/components/host/SettlementStatCard';
import { RefundFilterBar } from '../../components/admin/RefundFilterBar';
import { RefundRequestCard } from '../../components/admin/RefundRequestCard';

import { findRefundAll } from '../../api/refundApi';

const PAGE_SIZE = 10;

// 백엔드 RefundStatus → UI 상태 키 (RefundRequestCard interface)
// REQUESTED / APPROVED = 사용자 시각 "처리 중", COMPLETED = 완료
const STATUS_TO_UI = {
  REQUESTED: 'processing',
  APPROVED: 'processing',
  COMPLETED: 'completed',
};

// 백엔드 RefundRate → 환불율 숫자
const RATE_VALUE = {
  WEEK: 100,
  FOURTOSIX: 70,
  TWOTOTHREE: 50,
  ONEDAY: 30,
  DDAY: 0,
  FULL: 100,
};

// "2026.05.22 14:30" 형식
const formatDate = (iso) => {
  if (!iso) return '-';
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

// 호스트 사유 환불 식별 — refundReason 이 null + refundRate 가 FULL
const isHostRejectedRefund = (refund) =>
  refund.refundReason === null && refund.refundRate === 'FULL';

// 백엔드 RefundResDto → RefundRequestCard prop 형식 변환
// 회원·예약·공간 정보는 placeholder (해당 도메인 API 미연동 영역, 추후 admin 전용 join API 박을지 결정)
const toRefundCardItem = (refund) => {
  const refundAmtNumber = Number(refund.refundAmt ?? 0);
  return {
    id: refund.no,
    refundId: `RFD-${String(refund.no).padStart(6, '0')}`,
    userName: `회원 #${refund.rsvnNo}`, // memberNo 미노출 → rsvnNo 임시
    spaceName: `예약 #${refund.rsvnNo}`,
    spaceEmoji: '🏠',
    method: '-', // pay.method 별도 조회 필요 (N+1 회피)
    paidAmount: refundAmtNumber, // pay.finalAmt 별도 조회 필요, 임시 환불액으로 표시
    refundAmount: refundAmtNumber,
    rate: RATE_VALUE[refund.refundRate] ?? 0,
    requestedAt: formatDate(refund.requestedAt ?? refund.createdAt),
    completedAt:
      refund.status === 'COMPLETED' ? formatDate(refund.modifiedAt) : null,
    status: STATUS_TO_UI[refund.status] ?? 'processing',
    isHostRejected: isHostRejectedRefund(refund),
    alertMessage: null,
  };
};

export default function RefundList() {
  const navigate = useNavigate();

  const [refunds, setRefunds] = useState([]);
  const [tab, setTab] = useState('all');
  const [period, setPeriod] = useState('month');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const load = async () => {
      try {
        const list = await findRefundAll();
        setRefunds(list);
      } catch (err) {
        console.error('환불 전체 조회 실패', err);
      }
    };
    load();
  }, []);

  // 통계 카드 — 전체 기간 기준 (탭 영역과 분리, 어드민은 누적 수치 우선)
  const stats = useMemo(() => {
    const s = { total: refunds.length, processing: 0, completed: 0, hostRejected: 0 };
    refunds.forEach((r) => {
      const uiStatus = STATUS_TO_UI[r.status];
      if (uiStatus === 'processing') s.processing += 1;
      if (uiStatus === 'completed') s.completed += 1;
      if (isHostRejectedRefund(r)) s.hostRejected += 1;
    });
    return s;
  }, [refunds]);

  // 탭 정의
  const tabs = [
    { value: 'all', label: '전체', count: stats.total },
    { value: 'processing', label: '처리 중', count: stats.processing },
    { value: 'completed', label: '완료', count: stats.completed },
    { value: 'host_rejected', label: '호스트거절', count: stats.hostRejected },
  ];

  // 필터링 + 변환
  const filtered = useMemo(() => {
    return refunds
      .filter((r) => {
        const uiStatus = STATUS_TO_UI[r.status];
        if (tab === 'host_rejected') return isHostRejectedRefund(r);
        if (tab !== 'all' && uiStatus !== tab) return false;
        if (search) {
          const refundId = `RFD-${String(r.no).padStart(6, '0')}`;
          if (!refundId.includes(search.toUpperCase())) return false;
        }
        return true;
      })
      .map(toRefundCardItem);
  }, [refunds, tab, search]);

  // 페이지네이션
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleReset = () => {
    setTab('all');
    setPeriod('month');
    setSearch('');
    setPage(1);
  };

  return (
    <PageLayout
      title="환불 관리"
      description="모든 환불 요청을 모니터링하고 승인 처리하세요"
      maxWidth={1200}
    >
      <StatGrid>
        <SettlementStatCard
          icon="📊"
          label="총 환불 요청"
          value={stats.total.toLocaleString()}
          unit="건"
          subText="누적"
        />
        <SettlementStatCard
          icon="⏳"
          label="처리 중"
          value={stats.processing.toLocaleString()}
          unit="건"
          subText="승인 대기"
          highlight={stats.processing > 0}
        />
        <SettlementStatCard
          icon="✓"
          label="처리 완료"
          value={stats.completed.toLocaleString()}
          unit="건"
          subText="환불 완료"
        />
        <SettlementStatCard
          icon="🏠"
          label="호스트 거절"
          value={stats.hostRejected.toLocaleString()}
          unit="건"
          subText="100% 환불"
        />
      </StatGrid>

      <RefundFilterBar
        tabs={tabs}
        selectedTab={tab}
        onTabChange={setTab}
        selectedPeriod={period}
        onPeriodChange={setPeriod}
        searchQuery={search}
        onSearchChange={setSearch}
      />

      {pageItems.length === 0 ? (
        <EmptyState
          icon="📋"
          title="해당 조건에 환불 요청이 없어요"
          description="필터를 변경하시거나 다른 기간을 선택해보세요"
          action={
            <Button variant="secondary" onClick={handleReset}>
              필터 초기화
            </Button>
          }
        />
      ) : (
        <List>
          {pageItems.map((item) => (
            <RefundRequestCard
              key={item.id}
              request={item}
              onClick={(r) => navigate(`/admin/refund/${r.id}`)}
            />
          ))}
        </List>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onChange={setPage} />
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
`;
