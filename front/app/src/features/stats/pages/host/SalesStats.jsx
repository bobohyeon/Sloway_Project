import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { AdminKPICard } from '../../../dashboard/components/admin/AdminKPICard';
import { DonutChart } from '../../../dashboard/components/admin/DonutChart';
import { DailyTransactionChart } from '../../../dashboard/components/admin/DailyTransactionChart';
import { StatsPeriodFilter } from '../../components/admin/StatsPeriodFilter';
import { RankingList } from '../../components/admin/RankingList';

const DAILY_DATA = [
  { date: '2026-04-12', revenue: 1200000, bookings: 4 },
  { date: '2026-04-19', revenue: 1850000, bookings: 6 },
  { date: '2026-04-26', revenue: 2100000, bookings: 7 },
  { date: '2026-05-03', revenue: 3200000, bookings: 9 },
  { date: '2026-05-04', revenue: 2400000, bookings: 7 },
  { date: '2026-05-05', revenue: 4100000, bookings: 12 },
  { date: '2026-05-06', revenue: 2800000, bookings: 8 },
  { date: '2026-05-07', revenue: 3600000, bookings: 11 },
  { date: '2026-05-08', revenue: 4200000, bookings: 13 },
];

const SPACE_REVENUE = [
  { label: '청평 숲속 파인뷰 스테이', value: 18500000, color: '#7A8B71' },
  { label: '강릉 바다향 오피스', value: 14200000, color: '#A8B89F' },
  { label: '남해 올리브 팜스테이', value: 9300000, color: '#C5D1BD' },
];

const PAYMENT_METHODS = [
  { label: '카카오페이', value: 19500000, color: '#FEE500' },
  { label: '신용카드', value: 12800000, color: '#7A8B71' },
  { label: '네이버페이', value: 6400000, color: '#03C75A' },
  { label: '토스페이', value: 3300000, color: '#0064FF' },
];

const TOP_SPACES = [
  {
    name: '청평 숲속 파인뷰 스테이',
    icon: '🌲',
    meta: '경기 가평 · 워크앤스테이',
    value: 18500000,
    delta: '15%',
    deltaType: 'up',
  },
  {
    name: '강릉 바다향 오피스',
    icon: '🌊',
    meta: '강원 강릉 · 오피스',
    value: 14200000,
    delta: '8%',
    deltaType: 'up',
  },
  {
    name: '남해 올리브 팜스테이',
    icon: '🫒',
    meta: '경남 남해 · 숙소',
    value: 9300000,
    delta: '3%',
    deltaType: 'down',
  },
];

export default function SalesStats() {
  const nav = useNavigate();
  const [period, setPeriod] = useState('30days');

  const totalRevenue = SPACE_REVENUE.reduce((s, d) => s + d.value, 0);
  const commission = Math.floor(totalRevenue * 0.12);
  const settlement = totalRevenue - commission;

  return (
    <Page>
      <BackLink onClick={() => nav('/host/dashboard')}>
        ← 호스트 대시보드
      </BackLink>

      <Header>
        <Title>매출 통계</Title>
        <Description>운영 중인 공간의 매출 현황을 분석하세요</Description>
      </Header>

      <StatsPeriodFilter
        selectedPeriod={period}
        onPeriodChange={setPeriod}
        startDate="2026.04.09"
        endDate="2026.05.08"
        onDownload={() => alert('매출 데이터 CSV 다운로드')}
      />

      <KPIGrid>
        <AdminKPICard
          label="이번 달 매출"
          value={(totalRevenue / 10000).toLocaleString()}
          unit="만원"
          icon="💰"
          delta="12.5%"
          deltaType="up"
          subText="전월 대비"
          highlight
        />
        <AdminKPICard
          label="평균 객단가"
          value="328,500"
          unit="원"
          icon="🎯"
          delta="3.2%"
          deltaType="up"
          subText="전월 대비"
        />
        <AdminKPICard
          label="평균 점유율"
          value="68"
          unit="%"
          icon="📊"
          delta="3.5%"
          deltaType="up"
          subText="이번 달"
        />
        <AdminKPICard
          label="정산 예정액"
          value={(settlement / 10000).toLocaleString()}
          unit="만원"
          icon="🏦"
          subText={`수수료 ${(commission / 10000).toLocaleString()}만원 차감`}
        />
      </KPIGrid>

      <DailyTransactionChart data={DAILY_DATA} />

      <DonutGrid>
        <DonutChart
          title="공간별 매출"
          data={SPACE_REVENUE}
          totalLabel="총 매출"
          totalUnit="원"
          formatTotal={(v) => `${Math.floor(v / 10000).toLocaleString()}만`}
        />
        <DonutChart
          title="결제수단별 매출"
          data={PAYMENT_METHODS}
          totalLabel="총 결제"
          totalUnit="원"
          formatTotal={(v) => `${Math.floor(v / 10000).toLocaleString()}만`}
        />
      </DonutGrid>

      <RankingList
        title="공간별 매출 순위"
        items={TOP_SPACES}
        formatValue={(v) => `${v.toLocaleString()}원`}
      />
    </Page>
  );
}

const Page = styled.div`
  width: 100%;
  padding: var(--space-6) var(--space-5);
  animation: fadeInUp 480ms ease-out both;
`;

const BackLink = styled.button`
  font-size: 0.85rem;
  color: var(--gray-600);
  margin-bottom: var(--space-4);

  &:hover {
    color: var(--gray-800);
  }
`;

const Header = styled.div`
  margin-bottom: var(--space-5);
`;

const Title = styled.h1`
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 500;
  color: var(--gray-800);
  letter-spacing: -0.02em;
  margin-bottom: 4px;
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: var(--gray-600);
`;

const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-3);
  margin-bottom: var(--space-5);

  @media (max-width: 960px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const DonutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
  margin: var(--space-5) 0;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;
