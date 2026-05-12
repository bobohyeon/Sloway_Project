import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { AdminKPICard } from '../../../dashboard/components/admin/AdminKPICard';
import { DailyTransactionChart } from '../../../dashboard/components/admin/DailyTransactionChart';
import { DonutChart } from '../../../dashboard/components/admin/DonutChart';
import { StatsPeriodFilter } from '../../components/admin/StatsPeriodFilter';

const DAILY_DATA = [
  { date: '2026-04-12', revenue: 12000000, bookings: 42 },
  { date: '2026-04-19', revenue: 18500000, bookings: 61 },
  { date: '2026-04-26', revenue: 21000000, bookings: 73 },
  { date: '2026-05-03', revenue: 32000000, bookings: 95 },
  { date: '2026-05-04', revenue: 24000000, bookings: 78 },
  { date: '2026-05-05', revenue: 41000000, bookings: 124 },
  { date: '2026-05-06', revenue: 28000000, bookings: 84 },
  { date: '2026-05-07', revenue: 36000000, bookings: 112 },
  { date: '2026-05-08', revenue: 42000000, bookings: 134 },
];

const CATEGORY_REVENUE = [
  { label: '워크앤스테이', value: 42500000, color: '#7A8B71' },
  { label: '오피스', value: 28200000, color: '#A8B89F' },
  { label: '숙소', value: 18300000, color: '#C5D1BD' },
];

const PAYMENT_METHODS = [
  { label: '카카오페이', value: 41500000, color: '#FEE500' },
  { label: '신용카드', value: 28800000, color: '#7A8B71' },
  { label: '네이버페이', value: 12400000, color: '#03C75A' },
  { label: '토스페이', value: 6300000, color: '#0064FF' },
];

export default function StatsOverview() {
  const nav = useNavigate();
  const [period, setPeriod] = useState('30days');

  return (
    <Page>
      <Header>
        <Title>통합 대시보드</Title>
        <Description>플랫폼 전체 현황을 한눈에 확인하세요</Description>
      </Header>

      <StatsPeriodFilter
        selectedPeriod={period}
        onPeriodChange={setPeriod}
        startDate="2026.04.09"
        endDate="2026.05.08"
        onDownload={() => alert('전체 데이터 CSV 다운로드')}
      />

      <KPIGrid>
        <AdminKPICard
          label="이번 달 매출"
          value="8,420"
          unit="만원"
          icon="💰"
          delta="12.5%"
          deltaType="up"
          subText="전월 대비"
          highlight
        />
        <AdminKPICard
          label="총 회원수"
          value="12,458"
          unit="명"
          icon="👥"
          delta="2.1%"
          deltaType="up"
          subText="전월 대비"
        />
        <AdminKPICard
          label="총 예약수"
          value="3,742"
          unit="건"
          icon="📋"
          delta="8.4%"
          deltaType="up"
          subText="전월 대비"
        />
        <AdminKPICard
          label="활성 공간"
          value="348"
          unit="개"
          icon="🏠"
          delta="5%"
          deltaType="up"
          subText="이번 주"
        />
      </KPIGrid>

      <SectionTitle>일별 추이</SectionTitle>
      <DailyTransactionChart data={DAILY_DATA} />

      <SectionTitle>분포</SectionTitle>
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

      <SectionTitle>상세 통계</SectionTitle>
      <DetailGrid>
        <DetailCard onClick={() => nav('/admin/stats/revenue')}>
          <DetailIcon>💰</DetailIcon>
          <DetailInfo>
            <DetailTitle>매출 통계</DetailTitle>
            <DetailDesc>일별·지역별·카테고리별 매출 분석</DetailDesc>
          </DetailInfo>
          <Arrow>→</Arrow>
        </DetailCard>
        <DetailCard onClick={() => nav('/admin/stats/booking')}>
          <DetailIcon>📋</DetailIcon>
          <DetailInfo>
            <DetailTitle>예약 통계</DetailTitle>
            <DetailDesc>예약 현황·취소율·시간대별 분포</DetailDesc>
          </DetailInfo>
          <Arrow>→</Arrow>
        </DetailCard>
        <DetailCard onClick={() => nav('/admin/stats/member')}>
          <DetailIcon>👥</DetailIcon>
          <DetailInfo>
            <DetailTitle>회원 통계</DetailTitle>
            <DetailDesc>가입 추이·연령대·활동 분석</DetailDesc>
          </DetailInfo>
          <Arrow>→</Arrow>
        </DetailCard>
        <DetailCard onClick={() => nav('/admin/stats/space')}>
          <DetailIcon>🏠</DetailIcon>
          <DetailInfo>
            <DetailTitle>공간 통계</DetailTitle>
            <DetailDesc>인기 공간·카테고리별 점유율</DetailDesc>
          </DetailInfo>
          <Arrow>→</Arrow>
        </DetailCard>
      </DetailGrid>
    </Page>
  );
}

const Page = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-6) var(--space-5);
  animation: fadeInUp 480ms ease-out both;
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
  margin: var(--space-5) 0;

  @media (max-width: 960px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--gray-800);
  margin: var(--space-6) 0 var(--space-3);
`;

const DonutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const DetailCard = styled.button`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  text-align: left;
  cursor: pointer;
  transition: all 200ms ease;

  &:hover {
    border-color: var(--sage);
    transform: translateY(-2px);
  }
`;

const DetailIcon = styled.div`
  width: 44px;
  height: 44px;
  background: var(--cream);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  flex-shrink: 0;
`;

const DetailInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const DetailTitle = styled.div`
  font-size: 0.92rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 2px;
`;

const DetailDesc = styled.div`
  font-size: 0.75rem;
  color: var(--gray-600);
`;

const Arrow = styled.span`
  color: var(--gray-400);
  font-size: 1.1rem;
  transition: transform 200ms ease;

  ${DetailCard}:hover & {
    transform: translateX(4px);
    color: var(--sage);
  }
`;
