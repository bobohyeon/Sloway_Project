import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { StatCard } from '../../../pay_shared/components/StatCard';
import { Card, Section } from '../../../pay_shared/components';
import { HorizontalBarChart } from '../../components/admin/HorizontalBarChart';
import { VerticalBarChart } from '../../components/admin/VerticalBarChart';
import { StatsTabs } from '../../components/admin/StatsTabs';
import { DataTable } from '../../components/admin/DataTable';
import {
  findStatsMonthlySales,
  findStatsPayMethods,
  findStatsMonthlyTrend,
  findStatsRefund,
} from '../../api/statsApi';
import { StatsRangeTabs } from '../../components/admin/StatsRangeTabs';
import { rangeLabel } from '../../components/admin/statsRange';

const PAY_METHOD_META = {
  KAKAOPAY: { label: '카카오페이', color: '#FEE500' },
  TOSSPAY: { label: '토스페이', color: '#0064FF' },
  NAVERPAY: { label: '네이버페이', color: '#03C75A' },
};

function getPrevMonth() {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - 1);
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

function formatWon(value) {
  const n = Number(value ?? 0);
  return `${n.toLocaleString()}원`;
}

function formatMan(value) {
  const n = Number(value ?? 0);
  return `${Math.floor(n / 10000).toLocaleString()}만`;
}

export default function StatsOverview() {
  const { year, month } = useMemo(() => getPrevMonth(), []);
  const [months, setMonths] = useState(1);

  const [summary, setSummary] = useState(null);
  const [methods, setMethods] = useState([]);
  const [trend, setTrend] = useState([]);
  const [refund, setRefund] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [view, setView] = useState('chart');

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    Promise.all([
      findStatsMonthlySales(year, month, months),
      findStatsPayMethods(year, month, months),
      findStatsMonthlyTrend(year, month, months),
      findStatsRefund(year, month, months),
    ])
      .then(([s, m, t, r]) => {
        if (!alive) return;
        setSummary(s);
        setMethods(m ?? []);
        setTrend(t ?? []);
        setRefund(r);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e?.response?.data?.message ?? '통계 조회에 실패했습니다.');
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [year, month, months]);

  const currentYm = `${year}-${String(month).padStart(2, '0')}`;

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

  const trendChartData = trend.map((row) => {
    const isCurrent = row.yearMonth === currentYm;
    return {
      label: row.yearMonth?.slice(5) ?? '',
      value: Number(row.totalAmt ?? 0),
      highlight: isCurrent,
    };
  });

  return (
    <PageLayout
      title="통계 대시보드"
      description={`${rangeLabel(months)} 결제·환불 통계 요약`}
      maxWidth={1200}
    >
      <FilterBar>
        <StatsRangeTabs value={months} onChange={setMonths} />
        {loading && <StatusText>불러오는 중...</StatusText>}
        {error && <ErrorText>{error}</ErrorText>}
      </FilterBar>

      <KPIGrid>
        <StatCard
          label="총 매출"
          value={Number(summary?.totalAmt ?? 0).toLocaleString()}
          unit="원"
        />
        <StatCard
          label="결제 건수"
          value={Number(summary?.payCount ?? 0).toLocaleString()}
          unit="건"
        />
        <StatCard
          label="평균 결제금"
          value={Number(summary?.avgAmt ?? 0).toLocaleString()}
          unit="원"
        />
        <StatCard
          label="순매출 (환불 차감)"
          value={Number(summary?.netAmt ?? 0).toLocaleString()}
          unit="원"
          highlight
        />
      </KPIGrid>

      <StatsTabs
        active={view}
        onChange={setView}
        tabs={[
          { key: 'chart', label: '차트' },
          { key: 'list', label: '리스트' },
        ]}
      />

      {view === 'chart' ? (
        <>
          <ChartBlock>
            {methodChartData.length > 0 ? (
              <HorizontalBarChart
                title="결제수단별 매출"
                data={methodChartData}
                formatValue={formatWon}
              />
            ) : (
              <Section title="결제수단별 매출">
                <EmptyCard padded>
                  해당 월에 집계된 결제수단 데이터가 없습니다.
                </EmptyCard>
              </Section>
            )}
          </ChartBlock>

          <ChartBlock>
            {trendChartData.length > 0 ? (
              <VerticalBarChart
                title={`${rangeLabel(months)} 매출 추이`}
                data={trendChartData}
                formatValue={formatMan}
              />
            ) : (
              <Section title={`${rangeLabel(months)} 매출 추이`}>
                <EmptyCard padded>시계열 데이터가 없습니다.</EmptyCard>
              </Section>
            )}
          </ChartBlock>
        </>
      ) : (
        <>
          <DataTable
            title="결제수단별 매출"
            columns={['결제수단', '매출', '건수']}
            rows={methodChartData.map((d) => [
              d.label,
              `${Number(d.value).toLocaleString()}원`,
              d.subValue,
            ])}
          />
          <DataTable
            title={`${rangeLabel(months)} 매출 추이`}
            columns={['월', '매출']}
            rows={trendChartData.map((d) => [
              `${d.label}월`,
              `${Number(d.value).toLocaleString()}원`,
            ])}
          />
        </>
      )}

      <Section title="환불 통계">
        <RefundCard padded>
          <RefundRow>
            <RefundLabel>환불 건수</RefundLabel>
            <RefundValue>
              {Number(refund?.refundCount ?? 0).toLocaleString()}
              <RefundUnit>건</RefundUnit>
            </RefundValue>
          </RefundRow>
          <RefundDivider />
          <RefundRow>
            <RefundLabel>환불 총액</RefundLabel>
            <RefundValue>
              {Number(refund?.refundAmt ?? 0).toLocaleString()}
              <RefundUnit>원</RefundUnit>
            </RefundValue>
          </RefundRow>
          <RefundDivider />
          <RefundRow>
            <RefundLabel>환불율</RefundLabel>
            <RefundValue $accent>
              {Number(refund?.refundRate ?? 0)}
              <RefundUnit>%</RefundUnit>
            </RefundValue>
          </RefundRow>
        </RefundCard>
      </Section>
    </PageLayout>
  );
}

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-5);
  flex-wrap: wrap;
`;

const FilterGroup = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const FilterLabel = styled.span`
  font-size: 0.82rem;
  color: var(--gray-600);
`;

const Select = styled.select`
  padding: 6px 10px;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  background: var(--white);
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 0.85rem;
  color: var(--gray-800);
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--sage);
  }
`;

const StatusText = styled.span`
  font-size: 0.78rem;
  color: var(--gray-400);
  margin-left: auto;
`;

const ErrorText = styled.span`
  font-size: 0.82rem;
  color: #c0392b;
  margin-left: auto;
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
  text-align: center;
  color: var(--gray-400);
  font-size: 0.88rem;
  padding: var(--space-6) var(--space-5);
`;

const RefundCard = styled(Card)`
  display: flex;
  align-items: stretch;
  gap: 0;

  @media (max-width: 720px) {
    flex-direction: column;
  }
`;

const RefundRow = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: var(--space-3) var(--space-4);
`;

const RefundLabel = styled.span`
  font-size: 0.78rem;
  color: var(--gray-400);
`;

const RefundValue = styled.span`
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 500;
  color: ${(p) => (p.$accent ? 'var(--sage)' : 'var(--gray-800)')};
  letter-spacing: -0.02em;
  display: inline-flex;
  align-items: baseline;
  gap: 3px;
`;

const RefundUnit = styled.span`
  font-size: 0.82rem;
  color: var(--gray-600);
`;

const RefundDivider = styled.div`
  width: 1px;
  background: var(--gray-200);

  @media (max-width: 720px) {
    width: 100%;
    height: 1px;
  }
`;
