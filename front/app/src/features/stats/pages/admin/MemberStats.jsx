import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { AdminKPICard } from '../../../dashboard/components/admin/AdminKPICard'
import { DonutChart } from '../../../dashboard/components/admin/DonutChart'
import { DailyTransactionChart } from '../../../dashboard/components/admin/DailyTransactionChart'
import { StatsPeriodFilter } from '../../components/admin/StatsPeriodFilter'
import { StatsDistribution } from '../../components/admin/StatsDistribution'

const DAILY_SIGNUPS = [
  { date: '2026-04-12', revenue: 18, bookings: 4 },
  { date: '2026-04-19', revenue: 22, bookings: 6 },
  { date: '2026-04-26', revenue: 28, bookings: 8 },
  { date: '2026-05-03', revenue: 32, bookings: 9 },
  { date: '2026-05-04', revenue: 24, bookings: 6 },
  { date: '2026-05-05', revenue: 42, bookings: 12 },
  { date: '2026-05-06', revenue: 38, bookings: 11 },
  { date: '2026-05-07', revenue: 45, bookings: 14 },
  { date: '2026-05-08', revenue: 52, bookings: 18 },
]

const AGE_DIST = [
  { label: '20대', value: 4520, color: '#7A8B71' },
  { label: '30대', value: 5180, color: '#A8B89F' },
  { label: '40대', value: 2120, color: '#C5D1BD' },
  { label: '50대 이상', value: 638, color: '#D4861F' },
]

const GENDER_DIST = [
  { label: '여성', value: 6850, color: '#A8B89F' },
  { label: '남성', value: 5408, color: '#7A8B71' },
  { label: '미지정', value: 200, color: '#E2E8DC' },
]

const SIGNUP_VIA = [
  { label: '카카오', value: 5240, color: '#FEE500' },
  { label: '이메일', value: 3890, color: '#7A8B71' },
  { label: '네이버', value: 2180, color: '#03C75A' },
  { label: '구글', value: 1148, color: '#4285F4' },
]

const ACTIVITY_DIST = [
  {
    label: '활성 (최근 7일 접속)',
    count: 4250,
    color: '#7A8B71',
    description: '주 1회 이상 접속하는 활성 사용자',
  },
  {
    label: '준활성 (30일 이내 접속)',
    count: 5180,
    color: '#A8B89F',
    description: '월 1회 정도 접속',
  },
  {
    label: '휴면 (30~180일)',
    count: 2240,
    color: '#C5D1BD',
    description: '오랜만에 접속하지 않는 사용자',
  },
  {
    label: '비활성 (180일+)',
    count: 788,
    color: '#E2E8DC',
    description: '6개월 이상 미접속',
  },
]

export default function MemberStats() {
  const nav = useNavigate()
  const [period, setPeriod] = useState('30days')

  return (
    <Page>
      <BackLink onClick={() => nav('/admin/dashboard')}>← 관리자 대시보드</BackLink>

      <Header>
        <Title>회원 통계</Title>
        <Description>회원 구성과 가입 트렌드를 분석하세요</Description>
      </Header>

      <StatsPeriodFilter
        selectedPeriod={period}
        onPeriodChange={setPeriod}
        startDate="2026.04.09"
        endDate="2026.05.08"
        onDownload={() => alert('회원 데이터 CSV 다운로드')}
      />

      <KPIGrid>
        <AdminKPICard
          label="총 회원수"
          value="12,458"
          unit="명"
          icon="👥"
          subText="전체 누적"
          highlight
        />
        <AdminKPICard
          label="신규 가입"
          value="142"
          unit="명"
          icon="✨"
          delta="18%"
          deltaType="up"
          subText="이번 달"
        />
        <AdminKPICard
          label="활성 사용자"
          value="4,250"
          unit="명"
          icon="🌱"
          subText={`MAU ${((4250 / 12458) * 100).toFixed(0)}%`}
        />
        <AdminKPICard
          label="이탈률"
          value="6.3"
          unit="%"
          icon="📉"
          delta="0.8%"
          deltaType="down"
          subText="전월 대비"
        />
      </KPIGrid>

      <DailyTransactionChart data={DAILY_SIGNUPS} />

      <DonutGrid>
        <DonutChart
          title="연령대 분포"
          data={AGE_DIST}
          totalLabel="총 회원"
          totalUnit="명"
          formatTotal={(v) => v.toLocaleString()}
        />
        <DonutChart
          title="성별 분포"
          data={GENDER_DIST}
          totalLabel="총 회원"
          totalUnit="명"
          formatTotal={(v) => v.toLocaleString()}
        />
      </DonutGrid>

      <ChartGap />

      <DonutGrid>
        <DonutChart
          title="가입 경로별"
          data={SIGNUP_VIA}
          totalLabel="총 가입"
          totalUnit="명"
          formatTotal={(v) => v.toLocaleString()}
        />
        <Card>
          <StatsDistribution title="활성도 분포" items={ACTIVITY_DIST} />
        </Card>
      </DonutGrid>
    </Page>
  )
}

const Page = styled.div`
  width: 100%;
  padding: var(--space-6) var(--space-5);
  animation: fadeInUp 480ms ease-out both;
`

const BackLink = styled.button`
  font-size: 0.85rem;
  color: var(--gray-600);
  margin-bottom: var(--space-4);

  &:hover {
    color: var(--gray-800);
  }
`

const Header = styled.div`
  margin-bottom: var(--space-5);
`

const Title = styled.h1`
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 500;
  color: var(--gray-800);
  letter-spacing: -0.02em;
  margin-bottom: 4px;
`

const Description = styled.p`
  font-size: 0.9rem;
  color: var(--gray-600);
`

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
`

const DonutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
  margin-top: var(--space-5);

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`

const ChartGap = styled.div`
  height: var(--space-3);
`

const Card = styled.div``
