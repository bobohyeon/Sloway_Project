import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { FaHome, FaPlusCircle, FaCheckCircle, FaPause } from 'react-icons/fa';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { StatCard } from '../../../pay_shared/components/StatCard';
import { Card, Section } from '../../../pay_shared/components';
import { HorizontalBarChart } from '../../components/admin/HorizontalBarChart';
import { DataTable } from '../../components/admin/DataTable';
import { findSpaceStats } from '../../api/statsApi';
import { StatsRangeTabs } from '../../components/admin/StatsRangeTabs';
import { rangeLabel, getAnchorMonth } from '../../components/admin/statsRange';

const TYPE_META = {
  office: { label: '오피스', color: '#0064FF' },
  station: { label: '숙소', color: 'var(--sage)' },
  workStay: { label: '워크앤스테이', color: '#F5A623' },
};

export default function SpaceStats() {
  const { year, month } = useMemo(() => getAnchorMonth(), []);
  const [months, setMonths] = useState(3); // 디폴트 3개월

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    findSpaceStats(year, month, months)
      .then((data) => {
        if (alive) setStats(data);
      })
      .catch((e) => {
        if (alive)
          setError(e?.response?.data?.message ?? '공간 통계 조회에 실패했습니다.');
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [year, month, months]);

  const typeChartData = (stats?.byType ?? []).map((row) => {
    const meta = TYPE_META[row.type] ?? { label: row.type, color: 'var(--sage)' };
    return {
      label: meta.label,
      value: Number(row.count ?? 0),
      color: meta.color,
    };
  });

  return (
    <PageLayout
      title="공간 통계"
      description={`${rangeLabel(months)} 공간 등록·운영 현황`}
      maxWidth={1200}
    >
      <FilterBar>
        <StatsRangeTabs value={months} onChange={setMonths} />
        {loading && <StatusText>불러오는 중...</StatusText>}
        {error && <ErrorText>{error}</ErrorText>}
      </FilterBar>

      <KPIGrid>
        <StatCard
          label="등록 공간"
          value={Number(stats?.total ?? 0).toLocaleString()}
          unit="개"
          icon={<FaHome />}
          highlight
        />
        <StatCard
          label="신규 등록"
          value={Number(stats?.newReg ?? 0).toLocaleString()}
          unit="개"
          icon={<FaPlusCircle />}
        />
        <StatCard
          label="운영 중"
          value={Number(stats?.active ?? 0).toLocaleString()}
          unit="개"
          icon={<FaCheckCircle />}
        />
        <StatCard
          label="승인 대기"
          value={Number(stats?.pending ?? 0).toLocaleString()}
          unit="개"
          icon={<FaPause />}
        />
      </KPIGrid>

      <ChartBlock>
        {typeChartData.length > 0 ? (
          <HorizontalBarChart
            title="공간 타입별 분포"
            data={typeChartData}
            formatValue={(v) => `${Number(v).toLocaleString()}개`}
          />
        ) : (
          <Section title="공간 타입별 분포">
            <EmptyCard padded>표시할 공간 분포 데이터가 없습니다.</EmptyCard>
          </Section>
        )}
      </ChartBlock>

      <DataTable
        title="공간 타입별 분포"
        columns={['공간 타입', '개수']}
        rows={typeChartData.map((d) => [
          d.label,
          `${Number(d.value).toLocaleString()}개`,
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
