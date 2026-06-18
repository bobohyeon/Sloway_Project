import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import { EmptyState } from '../../../pay_shared/components';
import { PaymentFilterBar } from '../../components/user/PaymentFilterBar';
import { PaymentListItem } from '../../components/user/PaymentListItem';
import { ReceiptModal } from '../../components/user/ReceiptModal';
import { Pagination } from '../../../pay_shared/components/Pagination';
import { findPaysByMemberNo } from '../../api/payApi';

const PAGE_SIZE = 10;
import { useAuth } from '../../../auth/hooks/useAuth';

const emptyTitleByTab = (tab) => {
  if (tab === 'completed') return '결제 완료된 내역이 없어요';
  if (tab === 'refunded') return '환불된 내역이 없어요';
  return '결제 내역이 없어요';
};

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
`;

const STATUS_TO_UI = {
  READY: 'pending',
  COMPLETED: 'completed',
  CANCELED: 'refunded',
};

const METHOD_INFO = {
  KAKAOPAY: { label: '카카오페이', icon: '💛' },
  TOSSPAY: { label: '토스페이', icon: '💙' },
};

const TABS = [
  { value: 'all', label: '전체' },
  { value: 'completed', label: '결제 완료' },
  { value: 'refunded', label: '환불' },
];

const periodToCutoffMs = (period) => {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  if (period === 'month') return now - 30 * day;
  if (period === '3months') return now - 90 * day;
  if (period === '6months') return now - 180 * day;
  if (period === 'year') return now - 365 * day;
  return 0; // 'all'
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
    emoji: '🏠',
    thumbnail: resDto.thumbnail ?? null,
    space: resDto.spaceName ?? `예약 #${resDto.rsvnNo}`,
    paidAt: formatPaidAt(resDto.approvedAt ?? resDto.createdAt),
    amount: resDto.finalAmt ?? 0,
  };
};

export default function PaymentHistory() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const memberNo = user?.memberNo;

  const [pays, setPays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('3months');
  const [receiptPay, setReceiptPay] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!memberNo) {
      navigate('/login', { replace: true });
      return;
    }
    const load = async () => {
      setLoading(true);
      try {
        const list = await findPaysByMemberNo(memberNo);
        // 결제 도중 이탈(READY)은 미완료라 내역에서 제외 — 카카오 결제창에서 뒤로가기로 남은 '대기' 건 숨김
        // (다시 결제는 예약 상세의 '결제하기'로 진행)
        setPays(list.filter((p) => p.status !== 'READY'));
        setError(null);
      } catch (err) {
        console.error('결제 내역 조회 실패', err);
        setError(err?.response?.data?.msg ?? '결제 내역을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [memberNo, navigate]);

  const tabsWithCount = useMemo(() => {
    const counts = { all: pays.length, completed: 0, refunded: 0 };
    pays.forEach((p) => {
      const key = STATUS_TO_UI[p.status];
      if (key && counts[key] !== undefined) counts[key] += 1;
    });
    return TABS.map((t) => ({ ...t, count: counts[t.value] }));
  }, [pays]);

  const filteredPayments = useMemo(() => {
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

  const totalPages = Math.ceil(filteredPayments.length / PAGE_SIZE);
  const paged = filteredPayments.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleItemClick = (payment) => {
    navigate(`/user/payment/${payment.no}`);
  };

  const handleReceiptClick = (payment) => {
    const original = pays.find((p) => p.no === payment.no);
    if (original) setReceiptPay(original);
  };

  return (
    <PageLayout
      title="결제 내역"
      description="모든 결제 내역을 확인하세요"
      backTo="/user/mypage"
      backLabel="마이페이지"
    >
      <PaymentFilterBar
        tabs={tabsWithCount}
        selectedTab={selectedTab}
        onTabChange={(v) => {
          setSelectedTab(v);
          setPage(1);
        }}
        selectedPeriod={selectedPeriod}
        onPeriodChange={(v) => {
          setSelectedPeriod(v);
          setPage(1);
        }}
      />

      {loading ? (
        <EmptyState
          icon="⏳"
          title="불러오는 중…"
          description="결제 내역을 확인하고 있어요"
        />
      ) : error ? (
        <EmptyState icon="⚠️" title="조회 실패" description={error} />
      ) : filteredPayments.length === 0 ? (
        <EmptyState
          icon="🧾"
          title={emptyTitleByTab(selectedTab)}
          description="다른 기간을 선택하거나 새로운 예약을 진행해보세요"
        />
      ) : (
        <>
          <List>
            {paged.map((payment) => (
              <PaymentListItem
                key={payment.no}
                payment={payment}
                onClick={handleItemClick}
                onReceiptClick={handleReceiptClick}
              />
            ))}
          </List>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onChange={(p) => {
              setPage(p);
              window.scrollTo(0, 0);
            }}
          />
        </>
      )}

      {receiptPay && (
        <ReceiptModal pay={receiptPay} onClose={() => setReceiptPay(null)} />
      )}
    </PageLayout>
  );
}
