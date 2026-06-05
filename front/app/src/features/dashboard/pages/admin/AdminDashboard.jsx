import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  FaCoins,
  FaReceipt,
  FaUndo,
  FaChartLine,
  FaChartPie,
  FaFileInvoiceDollar,
  FaGift,
  FaMoneyBillWave,
} from 'react-icons/fa';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { StatCard } from '../../../pay_shared/components/StatCard';
import { Card, Section, EmptyState } from '../../../pay_shared/components';
import { HorizontalBarChart } from '../../../stats/components/admin/HorizontalBarChart';
import {
  findStatsMonthlySales,
  findStatsPayMethods,
  findStatsRefund,
} from '../../../stats/api/statsApi';
import { getAnchorMonth } from '../../../stats/components/admin/statsRange';

const PAY_METHOD_META = {
  KAKAOPAY: { label: '카카오페이', color: '#FEE500' },
  TOSSPAY: { label: '토스페이', color: '#0064FF' },
  NAVERPAY: { label: '네이버페이', color: '#03C75A' },
};

const QUICK_ACTIONS = [
  {
    id: 1,
    icon: <FaReceipt />,
    title: '결제 관리',
    description: '전체 결제 내역 조회',
    path: '/admin/payment',
  },
  {
    id: 2,
    icon: <FaUndo />,
    title: '환불 관리',
    description: '환불 요청 모니터링',
    path: '/admin/refund',
  },
  {
    id: 3,
    icon: <FaFileInvoiceDollar />,
    title: '수수료 정책',
    description: '공간 타입별 수수료',
    path: '/admin/commission-policy',
  },
  {
    id: 4,
    icon: <FaChartLine />,
    title: '통계 대시보드',
    description: '월별 매출·환불 상세',
    path: '/admin/stats/sales',
  },
  {
    id: 5,
    icon: <FaGift />,
    title: '쿠폰 이벤트',
    description: '쿠폰 게시·종료',
    path: '/admin/coupon/event',
  },
  {
    id: 6,
    icon: <FaMoneyBillWave />,
    title: '정산 관리',
    description: '호스트 정산 내역',
    path: '/admin/settlement/dashboard',
  },
];

export default function AdminDashboard() {
  const nav = useNavigate();
  const { year, month } = useMemo(() => getAnchorMonth(), []);

  const [summary, setSummary] = useState(null);
  const [methods, setMethods] = useState([]);
  const [refund, setRefund] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    Promise.all([
      findStatsMonthlySales(year, month),
      findStatsPayMethods(year, month),
      findStatsRefund(year, month),
    ])
      .then(([s, m, r]) => {
        if (!alive) return;
        setSummary(s);
        setMethods(m ?? []);
        setRefund(r);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e?.response?.data?.message ?? '대시보드 데이터를 불러오지 못했습니다.');
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [year, month]);

  const methodChartData = methods.map((row) => {
    const meta = PAY_METHOD_META[row.payMethod] ?? {
      label: row.payMethod,
      color: 'var(--sage)',
    };
    return {
      label: meta.label,
      value: Number(row.totalAmt ?? 0),
      color: meta.color,
      subValue: `${Number(row.payCount ?? 0).toLocaleString()}건`,
    };
  });

  return (
    <PageLayout maxWidth={1200}>
      <Greeting>
        <GreetingTitle>
          관리자 <Highlight>대시보드</Highlight>
        </GreetingTitle>
        <GreetingSub>
          {year}년 {month}월 기준 결제·환불 요약입니다. 회원·공간·리뷰 운영 알림은
          해당 도메인 통합 단계 진입 후 노출됩니다.
        </GreetingSub>
        {loading && <StatusText>불러오는 중...</StatusText>}
        {error && <ErrorText>{error}</ErrorText>}
      </Greeting>

      <KPIGrid>
        <StatCard
          label="이번 달 매출"
          value={Number(summary?.totalAmt ?? 0).toLocaleString()}
          unit="원"
          icon={<FaCoins />}
          highlight
        />
        <StatCard
          label="결제 건수"
          value={Number(summary?.payCount ?? 0).toLocaleString()}
          unit="건"
          icon={<FaReceipt />}
        />
        <StatCard
          label="환불 건수"
          value={Number(refund?.refundCount ?? 0).toLocaleString()}
          unit="건"
          icon={<FaUndo />}
        />
        <StatCard
          label="환불율"
          value={Number(refund?.refundRate ?? 0)}
          unit="%"
          icon={<FaChartPie />}
        />
      </KPIGrid>

      <ChartBlock>
        {methodChartData.length > 0 ? (
          <HorizontalBarChart
            title="결제수단별 매출"
            data={methodChartData}
            formatValue={(v) => `${Number(v).toLocaleString()}원`}
            action={
              <DetailLink onClick={() => nav('/admin/stats/sales')}>
                상세 통계 →
              </DetailLink>
            }
          />
        ) : (
          <Section title="결제수단별 매출">
            <EmptyCard padded>
              <EmptyState
                title="집계 데이터가 없습니다"
                description="해당 월에 적재된 결제수단 데이터가 없습니다."
              />
            </EmptyCard>
          </Section>
        )}
      </ChartBlock>

      <Section title="운영 알림">
        <EmptyCard padded>
          <EmptyState
            title="운영 알림 통합 대기"
            description="회원·공간·리뷰 도메인 API 합류 후 신규 가입·공간 승인·신고 영역이 노출됩니다."
          />
        </EmptyCard>
      </Section>

      <Section title="빠른 액션">
        <QuickGrid>
          {QUICK_ACTIONS.map((a) => (
            <QuickCard key={a.id} onClick={() => nav(a.path)}>
              <QuickIcon>{a.icon}</QuickIcon>
              <QuickTitle>{a.title}</QuickTitle>
              <QuickDesc>{a.description}</QuickDesc>
            </QuickCard>
          ))}
        </QuickGrid>
      </Section>
    </PageLayout>
  );
}

const Greeting = styled.div`
  margin-bottom: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const GreetingTitle = styled.h1`
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 500;
  color: var(--gray-800);
  letter-spacing: -0.02em;
  margin: 0;
`;

const Highlight = styled.span`
  color: var(--sage);
`;

const GreetingSub = styled.p`
  font-size: 0.85rem;
  color: var(--gray-600);
  margin: 0;
  line-height: 1.5;
`;

const StatusText = styled.span`
  font-size: 0.78rem;
  color: var(--gray-400);
`;

const ErrorText = styled.span`
  font-size: 0.82rem;
  color: #c0392b;
`;

const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-3);
  margin-bottom: var(--space-6);

  @media (max-width: 960px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ChartBlock = styled.div`
  margin-bottom: var(--space-5);
`;

const EmptyCard = styled(Card)`
  padding: var(--space-6) var(--space-5);
`;

const DetailLink = styled.button`
  background: transparent;
  border: none;
  color: var(--sage);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 0;

  &:hover {
    text-decoration: underline;
  }
`;

const QuickGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);

  @media (max-width: 720px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const QuickCard = styled.button`
  text-align: left;
  padding: var(--space-4);
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 200ms ease;
  font-family: 'Noto Sans KR', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 6px;

  &:hover {
    border-color: var(--sage);
    background: var(--cream);
    transform: translateY(-1px);
  }
`;

const QuickIcon = styled.span`
  font-size: 1.2rem;
  color: var(--sage);
`;

const QuickTitle = styled.span`
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--gray-800);
`;

const QuickDesc = styled.span`
  font-size: 0.78rem;
  color: var(--gray-600);
  line-height: 1.4;
`;
