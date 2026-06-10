import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import {
  FaUsers,
  FaUserPlus,
  FaUserCheck,
  FaUserClock,
} from 'react-icons/fa';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { StatCard } from '../../../pay_shared/components/StatCard';
import { Card, Section } from '../../../pay_shared/components';
import { VerticalBarChart } from '../../components/admin/VerticalBarChart';
import { DataTable } from '../../components/admin/DataTable';
import { findMemberStats } from '../../api/statsApi';
import { StatsRangeTabs } from '../../components/admin/StatsRangeTabs';
import { rangeLabel, getAnchorMonth } from '../../components/admin/statsRange';

export default function MemberStats() {
  const { year, month } = useMemo(() => getAnchorMonth(), []);
  const [months, setMonths] = useState(3); // 디폴트 3개월

  const [stats, setStats] = useState(null);
  // 초기값 true — effect 동기 본문에서 setLoading(true) 호출 금지(set-state-in-effect)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;

    findMemberStats(year, month, months)
      .then((data) => {
        if (alive) {
          setStats(data);
          setError(null);
        }
      })
      .catch((e) => {
        if (alive)
          setError(e?.response?.data?.message ?? '회원 통계 조회에 실패했습니다.');
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
      title="회원 통계"
      description={`${rangeLabel(months)} 회원 가입·활동 추이`}
      maxWidth={1200}
    >
      <FilterBar>
        <StatsRangeTabs value={months} onChange={setMonths} />
        {loading && <StatusText>불러오는 중...</StatusText>}
        {error && <ErrorText>{error}</ErrorText>}
      </FilterBar>

      <KPIGrid>
        <StatCard
          label="누적 회원"
          value={Number(stats?.total ?? 0).toLocaleString()}
          unit="명"
          icon={<FaUsers />}
          highlight
        />
        <StatCard
          label="신규 가입"
          value={Number(stats?.newSignup ?? 0).toLocaleString()}
          unit="명"
          icon={<FaUserPlus />}
        />
        <StatCard
          label="활성 회원"
          value={Number(stats?.active ?? 0).toLocaleString()}
          unit="명"
          icon={<FaUserCheck />}
        />
        <StatCard
          label="탈퇴 회원"
          value={Number(stats?.withdrawn ?? 0).toLocaleString()}
          unit="명"
          icon={<FaUserClock />}
        />
      </KPIGrid>

      <ChartBlock>
        {trendChartData.length > 0 ? (
          <VerticalBarChart title={`${rangeLabel(months)} 가입 추이`} data={trendChartData} />
        ) : (
          <Section title={`${rangeLabel(months)} 가입 추이`}>
            <EmptyCard padded>표시할 가입 추이 데이터가 없습니다.</EmptyCard>
          </Section>
        )}
      </ChartBlock>

      <DataTable
        title={`${rangeLabel(months)} 가입 추이`}
        columns={['월', '가입 수']}
        rows={trendChartData.map((d) => [
          `${d.label}월`,
          `${Number(d.value).toLocaleString()}명`,
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
