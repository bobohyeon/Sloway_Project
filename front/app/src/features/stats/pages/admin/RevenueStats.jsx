import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { AdminKPICard } from '../../../dashboard/components/admin/AdminKPICard';
import { DonutChart } from '../../../dashboard/components/admin/DonutChart';
import { DailyTransactionChart } from '../../../dashboard/components/admin/DailyTransactionChart';
import { StatsPeriodFilter } from '../../components/admin/StatsPeriodFilter';
import { RankingList } from '../../components/admin/RankingList';

const DAILY_DATA = [
  { date: '2026-04-12', revenue: 6200000, bookings: 18 },
  { date: '2026-04-19', revenue: 7800000, bookings: 22 },
  { date: '2026-04-26', revenue: 8900000, bookings: 26 },
  { date: '2026-05-03', revenue: 12500000, bookings: 38 },
  { date: '2026-05-04', revenue: 9800000, bookings: 29 },
  { date: '2026-05-05', revenue: 14200000, bookings: 41 },
  { date: '2026-05-06', revenue: 11500000, bookings: 33 },
  { date: '2026-05-07', revenue: 13800000, bookings: 40 },
  { date: '2026-05-08', revenue: 15200000, bookings: 45 },
];

const CATEGORY_REVENUE = [
  { label: '워크앤스테이', value: 42500000, color: '#7A8B71' },
  { label: '숙소', value: 28300000, color: '#A8B89F' },
  { label: '오피스', value: 13400000, color: '#C5D1BD' },
];

const PAYMENT_METHODS = [
  { label: '카카오페이', value: 38500000, color: '#FEE500' },
  { label: '신용카드', value: 25200000, color: '#7A8B71' },
  { label: '네이버페이', value: 12800000, color: '#03C75A' },
  { label: '토스페이', value: 7700000, color: '#0064FF' },
];

const TOP_SPACES = [
  {
    name: '청평 숲속 파인뷰 스테이',
    icon: '🌲',
    meta: '경기 가평 · 워크앤스테이',
    value: 4180000,
    delta: '12%',
    deltaType: 'up',
  },
  {
    name: '강릉 바다향 오피스',
    icon: '🌊',
    meta: '강원 강릉 · 오피스',
    value: 3240000,
    delta: '8%',
    deltaType: 'up',
  },
  {
    name: '남해 올리브 팜스테이',
    icon: '🫒',
    meta: '경남 남해 · 숙소',
    value: 2950000,
    delta: '3%',
    deltaType: 'down',
  },
  {
    name: '양양 파도소리 빌라',
    icon: '🌅',
    meta: '강원 양양 · 워크앤스테이',
    value: 2780000,
    delta: '15%',
    deltaType: 'up',
  },
  {
    name: '성수 브릭라운지',
    icon: '🧱',
    meta: '서울 성수 · 오피스',
    value: 2450000,
    delta: '6%',
    deltaType: 'up',
  },
  {
    name: '제주 흑돌 별채',
    icon: '🌴',
    meta: '제주 서귀포 · 숙소',
    value: 2180000,
    delta: '4%',
    deltaType: 'down',
  },
  {
    name: '북촌 한옥 워크룸',
    icon: '🏯',
    meta: '서울 북촌 · 워크앤스테이',
    value: 1950000,
  },
  {
    name: '부산 광안 라운지',
    icon: '🌃',
    meta: '부산 광안리 · 오피스',
    value: 1820000,
  },
  {
    name: '경주 황남 한옥',
    icon: '🏛️',
    meta: '경북 경주 · 숙소',
    value: 1640000,
  },
  {
    name: '하동 차밭 농가',
    icon: '🍃',
    meta: '경남 하동 · 워크앤스테이',
    value: 1480000,
  },
];

export default function RevenueStats() {
  const nav = useNavigate();
  const [period, setPeriod] = useState('30days');

  return (
    <Page>
      <BackLink onClick={() => nav('/admin/dashboard')}>
        ← 관리자 대시보드
      </BackLink>

      <Header>
        <Title>매출 통계</Title>
        <Description>플랫폼 매출 현황과 트렌드를 분석하세요</Description>
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
          label="총 매출"
          value="84,200"
          unit="만원"
          icon="💰"
          delta="12.5%"
          deltaType="up"
          subText="전월 대비"
          highlight
        />
        <AdminKPICard
          label="플랫폼 수수료"
          value="9,860"
          unit="만원"
          icon="📊"
          subText="평균 11.7%"
        />
        <AdminKPICard
          label="호스트 정산액"
          value="74,340"
          unit="만원"
          icon="🏦"
          subText="총 매출의 88.3%"
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
      </KPIGrid>

      <DailyTransactionChart data={DAILY_DATA} />

      <DonutGrid>
        <DonutChart
          title="카테고리별 매출"
          data={CATEGORY_REVENUE}
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
        title="공간별 매출 TOP 10"
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
