import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { Button, EmptyState, Pagination } from '../../../pay_shared/components';
import { SettlementStatCard } from '../../../settlement/components/host/SettlementStatCard';
import { RefundFilterBar } from '../../components/admin/RefundFilterBar';
import { RefundRequestCard } from '../../components/admin/RefundRequestCard';

import { findRefundAll, findRefundStats } from '../../api/refundApi';

// REQUESTED / APPROVED = 사용자 시각 "처리 중" 단일 묶음
const STATUS_TO_UI = {
  REQUESTED: 'processing',
  APPROVED: 'processing',
  COMPLETED: 'completed',
};

const RATE_VALUE = {
  WEEK: 100,
  FOURTOSIX: 70,
  TWOTOTHREE: 50,
  ONEDAY: 30,
  DDAY: 0,
  FULL: 100,
};

const formatDate = (iso) => {
  if (!iso) return '-';
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

// 호스트 거절 환불 식별 — refundReason null + refundRate FULL 조합
const isHostRejectedRefund = (refund) =>
  refund.refundReason === null && refund.refundRate === 'FULL';

const toRefundCardItem = (refund) => {
  const refundAmtNumber = Number(refund.refundAmt ?? 0);
  return {
    id: refund.no,
    refundId: `RFD-${String(refund.no).padStart(6, '0')}`,
    // fetch join 으로 채워진 실데이터 우선, 없으면 식별번호 폴백
    userName: refund.memberName ?? `회원 #${refund.rsvnNo}`,
    spaceName: refund.spaceName ?? `예약 #${refund.rsvnNo}`,
    spaceEmoji: '🏠',
    thumbnail: refund.thumbnail ?? null,
    method: '-',
    paidAmount: refundAmtNumber,
    refundAmount: refundAmtNumber,
    rate: RATE_VALUE[refund.refundRate] ?? 0,
    requestedAt: formatDate(refund.requestedAt ?? refund.createdAt),
    completedAt:
      refund.status === 'COMPLETED' ? formatDate(refund.modifiedAt) : null,
    status: STATUS_TO_UI[refund.status] ?? 'processing',
    isHostRejected: isHostRejectedRefund(refund),
  };
};

export default function RefundList() {
  const navigate = useNavigate();

  const [content, setContent] = useState([]); // 현재 페이지 환불 목록(서버가 잘라서 줌)
  const [totalPages, setTotalPages] = useState(1); // 서버가 알려준 전체 페이지 수
  const [stats, setStats] = useState({
    total: 0,
    processing: 0,
    completed: 0,
    hostRejected: 0,
  });
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [page, setPage] = useState(1); // UI는 1-base, 서버는 0-base

  // 목록 — page/탭/기간 중 하나라도 바뀌면 서버에 재요청
  useEffect(() => {
    const load = async () => {
      try {
        const data = await findRefundAll(page - 1, selectedTab, selectedPeriod);
        setContent(data.content ?? []);
        setTotalPages(data.totalPages ?? 1);
      } catch (err) {
        console.error('환불 목록 조회 실패', err);
      }
    };
    load();
  }, [page, selectedTab, selectedPeriod]);

  // 통계 — 전체 상태별 집계(탭/기간과 무관하게 카드 4개가 항상 전체 기준)
  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await findRefundStats();
        setStats(data);
      } catch (err) {
        console.error('환불 통계 조회 실패', err);
      }
    };
    loadStats();
  }, []);

  // 탭/기간 바꾸면 1페이지로 리셋(안 하면 끝페이지에서 빈 결과 뜨는 버그)
  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setPage(1);
  };
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    setPage(1);
  };

  const tabs = useMemo(
    () => [
      { value: 'all', label: '전체', count: stats.total },
      // 회원 취소 = 전체 - 호스트 거절 (환불은 회원취소 ∪ 호스트거절로 양분됨)
      {
        value: 'member_cancel',
        label: '회원 취소',
        count: stats.total - stats.hostRejected,
      },
      { value: 'host_rejected', label: '호스트 거절', count: stats.hostRejected },
    ],
    [stats]
  );

  // 서버가 이미 필터·페이징한 결과라 클라에선 화면용 변환만
  const pageItems = useMemo(() => content.map(toRefundCardItem), [content]);

  const handleReset = () => {
    setSelectedTab('all');
    setSelectedPeriod('month');
    setPage(1);
  };

  return (
    <PageLayout
      title="환불 관리"
      description="모든 환불 요청을 모니터링하세요"
      maxWidth={1200}
    >
      <StatGrid>
        <SettlementStatCard
          icon="📊"
          label="총 환불"
          value={stats.total.toLocaleString()}
          unit="건"
          subText="환불 완료 기준"
        />
        <SettlementStatCard
          icon="👤"
          label="회원 취소"
          value={(stats.total - stats.hostRejected).toLocaleString()}
          unit="건"
          subText="회원 자발 취소"
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
        selectedTab={selectedTab}
        onTabChange={handleTabChange}
        selectedPeriod={selectedPeriod}
        onPeriodChange={handlePeriodChange}
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
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
  margin-bottom: var(--space-5);

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-5);
`;
