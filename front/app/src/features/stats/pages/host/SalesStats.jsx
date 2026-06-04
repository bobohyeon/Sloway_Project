import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { FaCoins, FaCalendarCheck, FaUndo, FaChartLine } from 'react-icons/fa';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { StatCard } from '../../../pay_shared/components/StatCard';
import { Card, Section } from '../../../pay_shared/components';
import { VerticalBarChart } from '../../components/admin/VerticalBarChart';
import { StatsTabs } from '../../components/admin/StatsTabs';
import { DataTable } from '../../components/admin/DataTable';
import { findHostSalesStats } from '../../api/statsApi';

const YEAR_OPTIONS = [2024, 2025, 2026];
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

function getPrevMonth() {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - 1);
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

function formatMan(value) {
  return `${Math.floor(Number(value ?? 0) / 10000).toLocaleString()}만`;
}

export default function SalesStats() {
  const init = useMemo(() => getPrevMonth(), []);
  const [year, setYear] = useState(init.year);
  const [month, setMonth] = useState(init.month);

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [view, setView] = useState('chart');

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await findHostSalesStats(year, month);
        if (alive) setStats(data);
      } catch (e) {
        if (alive)
          setError(e?.response?.data?.message ?? '매출 통계 조회에 실패했습니다.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [year, month]);

  const currentYm = `${year}-${String(month).padStart(2, '0')}`;

  const trendChartData = (stats?.trend ?? []).map((row) => ({
    label: row.yearMonth?.slice(5) ?? '',
    value: Number(row.totalAmt ?? 0),
    highlight: row.yearMonth === currentYm,
  }));

  return (
    <PageLayout
      title="매출 통계"
      description={`${year}년 ${month}월 내 공간 매출`}
      maxWidth={1200}
    >
      <FilterBar>
        <FilterGroup>
          <FilterLabel>연도</FilterLabel>
          <Select value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {YEAR_OPTIONS.map((y) => (
              <option key={y} value={y}>
                {y}년
              </option>
            ))}
          </Select>
        </FilterGroup>
        <FilterGroup>
          <FilterLabel>월</FilterLabel>
          <Select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            {MONTH_OPTIONS.map((m) => (
              <option key={m} value={m}>
                {m}월
              </option>
            ))}
          </Select>
        </FilterGroup>
        {loading && <StatusText>불러오는 중...</StatusText>}
        {error && <ErrorText>{error}</ErrorText>}
      </FilterBar>

      <KPIGrid>
        <StatCard
          label="이번 달 매출"
          value={Number(stats?.totalAmt ?? 0).toLocaleString()}
          unit="원"
          icon={<FaCoins />}
          highlight
        />
        <StatCard
          label="예약 건수"
          value={Number(stats?.payCount ?? 0).toLocaleString()}
          unit="건"
          icon={<FaCalendarCheck />}
        />
        <StatCard
          label="환불 차감"
          value={Number(stats?.refundAmt ?? 0).toLocaleString()}
          unit="원"
          icon={<FaUndo />}
        />
        <StatCard
          label="평균 결제금"
          value={Number(stats?.avgAmt ?? 0).toLocaleString()}
          unit="원"
          icon={<FaChartLine />}
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
        trendChartData.length > 0 ? (
          <VerticalBarChart
            title="최근 6개월 매출 추이"
            data={trendChartData}
            formatValue={formatMan}
          />
        ) : (
          <Section title="최근 6개월 매출 추이">
            <EmptyCard padded>표시할 매출 추이 데이터가 없습니다.</EmptyCard>
          </Section>
        )
      ) : (
        <DataTable
          title="최근 6개월 매출 추이"
          columns={['월', '매출']}
          rows={trendChartData.map((d) => [
            `${d.label}월`,
            `${Number(d.value).toLocaleString()}원`,
          ])}
        />
      )}
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

const EmptyCard = styled(Card)`
  text-align: center;
  color: var(--gray-400);
  font-size: 0.88rem;
  padding: var(--space-6) var(--space-5);
`;
