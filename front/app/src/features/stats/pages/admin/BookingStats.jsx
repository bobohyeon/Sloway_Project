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
import { findBookingStats } from '../../api/statsApi';

const YEAR_OPTIONS = [2024, 2025, 2026];
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

function getPrevMonth() {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - 1);
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

export default function BookingStats() {
  const init = useMemo(() => getPrevMonth(), []);
  const [year, setYear] = useState(init.year);
  const [month, setMonth] = useState(init.month);

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    findBookingStats(year, month)
      .then((data) => {
        if (alive) setStats(data);
      })
      .catch((e) => {
        if (alive)
          setError(e?.response?.data?.message ?? '예약 통계 조회에 실패했습니다.');
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [year, month]);

  const currentYm = `${year}-${String(month).padStart(2, '0')}`;

  const trendChartData = (stats?.trend ?? []).map((row) => ({
    label: row.yearMonth?.slice(5) ?? '',
    value: Number(row.count ?? 0),
    highlight: row.yearMonth === currentYm,
  }));

  return (
    <PageLayout
      title="예약 통계"
      description={`${year}년 ${month}월 예약 발생 추이와 상태 분포`}
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
          label="예약 건수"
          value={Number(stats?.total ?? 0).toLocaleString()}
          unit="건"
          icon={<FaCalendarCheck />}
          highlight
        />
        <StatCard
          label="확정"
          value={Number(stats?.confirmed ?? 0).toLocaleString()}
          unit="건"
          icon={<FaCheckCircle />}
        />
        <StatCard
          label="취소"
          value={Number(stats?.canceled ?? 0).toLocaleString()}
          unit="건"
          icon={<FaTimesCircle />}
        />
        <StatCard
          label="환불 연결"
          value={Number(stats?.refunded ?? 0).toLocaleString()}
          unit="건"
          icon={<FaUndo />}
        />
      </KPIGrid>

      {trendChartData.length > 0 ? (
        <VerticalBarChart title="최근 6개월 예약 추이" data={trendChartData} />
      ) : (
        <Section title="최근 6개월 예약 추이">
          <EmptyCard padded>표시할 예약 추이 데이터가 없습니다.</EmptyCard>
        </Section>
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
