import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import {
  FaCalendarCheck,
  FaUndo,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { StatCard } from '../../../pay_shared/components/StatCard';
import { Card, Section } from '../../../pay_shared/components';
import { VerticalBarChart } from '../../components/admin/VerticalBarChart';
import { DataTable } from '../../components/admin/DataTable';
import { findBookingStats } from '../../api/statsApi';
import { StatsRangeTabs } from '../../components/admin/StatsRangeTabs';
import { rangeLabel, getAnchorMonth } from '../../components/admin/statsRange';

export default function BookingStats() {
  const { year, month } = useMemo(() => getAnchorMonth(), []);
  const [months, setMonths] = useState(1); // 디폴트 이번 달

  const [stats, setStats] = useState(null);
  // 초기값 true — effect 동기 본문에서 setLoading(true) 호출 금지(set-state-in-effect)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;

    findBookingStats(year, month, months)
      .then((data) => {
        if (alive) {
          setStats(data);
          setError(null);
        }
      })
      .catch((e) => {
        if (alive)
          setError(
            e?.response?.data?.message ?? '예약 통계 조회에 실패했습니다.'
          );
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [year, month, months]);

  const currentYm = `${year}-${String(month).padStart(2, '0')}`;

  const trendChartData = (stats?.trend ?? []).map((row) => ({
    label: row.yearMonth?.slice(5) ?? '',
    value: Number(row.totalAmt ?? 0),
    highlight: row.yearMonth === currentYm,
  }));

  return (
    <PageLayout
      title="예약 통계"
      description={`${rangeLabel(months)} 예약 발생 추이와 상태 분포`}
      maxWidth={1200}
    >
      <FilterBar>
        <StatsRangeTabs value={months} onChange={setMonths} />
        {loading && <StatusText>불러오는 중...</StatusText>}
        {error && <ErrorText>{error}</ErrorText>}
      </FilterBar>

      <KPIGrid>
        <StatCard
          label="예약 건수"
          value={Number(stats?.total ?? 0).toLocaleString()}
          unit="건"
          icon={<FaCalendarCheck />}
        />
        <StatCard
          label="확정"
          value={Number(stats?.confirmed ?? 0).toLocaleString()}
          unit="건"
          icon={<FaCheckCircle />}
        />
        <StatCard
          label="환불"
          value={Number(stats?.canceled ?? 0).toLocaleString()}
          unit="건"
          icon={<FaTimesCircle />}
        />
        <StatCard
          label="이용 완료"
          value={Number(stats?.completed ?? 0).toLocaleString()}
          unit="건"
          icon={<FaUndo />}
        />
      </KPIGrid>

      <ChartBlock>
        {trendChartData.length > 0 ? (
          <VerticalBarChart
            title={`${rangeLabel(months)} 예약 추이`}
            data={trendChartData}
          />
        ) : (
          <Section title={`${rangeLabel(months)} 예약 추이`}>
            <EmptyCard padded>표시할 예약 추이 데이터가 없습니다.</EmptyCard>
          </Section>
        )}
      </ChartBlock>

      <DataTable
        title={`${rangeLabel(months)} 예약 추이`}
        columns={['월', '예약 수']}
        rows={trendChartData.map((d) => [
          `${d.label}월`,
          `${Number(d.value).toLocaleString()}건`,
        ])}
      />
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
