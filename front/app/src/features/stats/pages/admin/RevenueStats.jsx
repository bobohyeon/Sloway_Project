import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaCoins, FaUndo, FaChartLine } from 'react-icons/fa';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { StatCard } from '../../../pay_shared/components/StatCard';
import { Card, Section, EmptyState } from '../../../pay_shared/components';
import { VerticalBarChart } from '../../components/admin/VerticalBarChart';
import { StatsTabs } from '../../components/admin/StatsTabs';
import { DataTable } from '../../components/admin/DataTable';
import {
  findStatsMonthlySales,
  findStatsMonthlyTrend,
  findStatsRefund,
} from '../../api/statsApi';
import { StatsRangeTabs } from '../../components/admin/StatsRangeTabs';
import { rangeLabel } from '../../components/admin/statsRange';

function getPrevMonth() {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - 1);
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

export default function RevenueStats() {
  const nav = useNavigate();
  const { year, month } = useMemo(() => getPrevMonth(), []);
  const [months, setMonths] = useState(1);

  const [summary, setSummary] = useState(null);
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
      findStatsMonthlyTrend(year, month, months),
      findStatsRefund(year, month, months),
    ])
      .then(([s, t, r]) => {
        if (!alive) return;
        setSummary(s);
        setTrend(t ?? []);
        setRefund(r);
      })
      .catch((e) => {
        if (alive) setError(e?.response?.data?.message ?? '수익 통계 조회에 실패했습니다.');
      })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [year, month, months]);

  const currentYm = `${year}-${String(month).padStart(2, '0')}`;
  const trendData = trend.map((row) => ({
    label: row.yearMonth?.slice(5) ?? '',
    value: Number(row.totalAmt ?? 0),
    highlight: row.yearMonth === currentYm,
  }));

  return (
    <PageLayout
      title="수익 통계"
      description="월별 매출·환불·순매출 추이"
      maxWidth={1200}
    >
      <FilterBar>
        <StatsRangeTabs value={months} onChange={setMonths} />
        {loading && <StatusText>불러오는 중...</StatusText>}
        {error && <ErrorText>{error}</ErrorText>}
        <Spacer />
        <DetailLink onClick={() => nav('/admin/stats/sales')}>통합 대시보드 →</DetailLink>
      </FilterBar>

      <KPIGrid>
        <StatCard label="총 매출" value={Number(summary?.totalAmt ?? 0).toLocaleString()} unit="원" icon={<FaCoins />} highlight />
        <StatCard label="환불 총액" value={Number(refund?.refundAmt ?? 0).toLocaleString()} unit="원" icon={<FaUndo />} />
        <StatCard label="순매출 (환불 차감)" value={Number(summary?.netAmt ?? 0).toLocaleString()} unit="원" icon={<FaChartLine />} />
        <StatCard label="환불율" value={Number(refund?.refundRate ?? 0)} unit="%" icon={<FaUndo />} />
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
        <ChartBlock>
          {trendData.length > 0 ? (
            <VerticalBarChart
              title={`${rangeLabel(months)} 매출 추이`}
              data={trendData}
              formatValue={(v) =>
                `${Math.floor(Number(v) / 10000).toLocaleString()}만`
              }
            />
          ) : (
            <Section title={`${rangeLabel(months)} 매출 추이`}>
              <EmptyCard padded>
                <EmptyState
                  title="시계열 데이터가 없습니다"
                  description="배치 적재 진입 후 노출됩니다."
                />
              </EmptyCard>
            </Section>
          )}
        </ChartBlock>
      ) : (
        <DataTable
          title={`${rangeLabel(months)} 매출 추이`}
          columns={['월', '매출']}
          rows={trendData.map((d) => [
            `${d.label}월`,
            `${Number(d.value).toLocaleString()}원`,
          ])}
        />
      )}
    </PageLayout>
  );
}

const FilterBar = styled.div`
  display: flex; align-items: center; gap: var(--space-3);
  margin-bottom: var(--space-5); flex-wrap: wrap;
`;
const FilterGroup = styled.label`display: inline-flex; align-items: center; gap: 8px;`;
const FilterLabel = styled.span`font-size: 0.82rem; color: var(--gray-600);`;
const Select = styled.select`
  padding: 6px 10px; border: 1px solid var(--gray-200); border-radius: var(--radius-md);
  background: var(--white); font-family: 'Noto Sans KR', sans-serif;
  font-size: 0.85rem; color: var(--gray-800); cursor: pointer;
  &:focus { outline: none; border-color: var(--sage); }
`;
const StatusText = styled.span`font-size: 0.78rem; color: var(--gray-400);`;
const ErrorText = styled.span`font-size: 0.82rem; color: #c0392b;`;
const Spacer = styled.div`flex: 1;`;
const DetailLink = styled.button`
  background: transparent; border: none; color: var(--sage);
  font-size: 0.82rem; font-weight: 600; cursor: pointer; padding: 4px 0;
  &:hover { text-decoration: underline; }
`;
const KPIGrid = styled.div`
  display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-3);
  margin-bottom: var(--space-5);
  @media (max-width: 960px) { grid-template-columns: repeat(2, 1fr); }
`;
const ChartBlock = styled.div`margin-bottom: var(--space-5);`;
const EmptyCard = styled(Card)`padding: var(--space-6) var(--space-5);`;
