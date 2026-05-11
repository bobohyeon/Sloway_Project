import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { AdminKPICard } from '../../../dashboard/components/admin/AdminKPICard'
import { DonutChart } from '../../../dashboard/components/admin/DonutChart'
import { StatsPeriodFilter } from '../../components/admin/StatsPeriodFilter'
import { HorizontalBarChart } from '../../components/admin/HorizontalBarChart'
import { VerticalBarChart } from '../../components/admin/VerticalBarChart'
import { RankingList } from '../../components/admin/RankingList'

const CATEGORY_DIST = [
  { label: '워크앤스테이', value: 184, color: '#7A8B71' },
  { label: '숙소', value: 142, color: '#A8B89F' },
  { label: '코워킹오피스', value: 89, color: '#C5D1BD' },
]

const REGIONS = [
  { label: '서울', value: 92, icon: '🏙️' },
  { label: '경기', value: 78, icon: '🌳' },
  { label: '강원', value: 64, icon: '🏔️' },
  { label: '제주', value: 52, icon: '🌴' },
  { label: '경남', value: 38, icon: '🌊' },
  { label: '경북', value: 32, icon: '🏛️' },
  { label: '부산', value: 28, icon: '🌃' },
  { label: '충남', value: 18, icon: '🌾' },
  { label: '전남', value: 13, icon: '🍃' },
]

const RATING_DIST = [
  { label: '5.0', value: 38, highlight: true },
  { label: '4.5+', value: 156, highlight: true },
  { label: '4.0+', value: 142 },
  { label: '3.5+', value: 48 },
  { label: '3.0+', value: 22 },
  { label: '< 3.0', value: 9 },
]

const TOP_OCCUPANCY = [
  { name: '청평 숲속 파인뷰 스테이', icon: '🌲', meta: '경기 가평 · 워크앤스테이', value: 92, delta: '4%', deltaType: 'up' },
  { name: '제주 흑돌 별채', icon: '🌴', meta: '제주 서귀포 · 숙소', value: 88 },
  { name: '강릉 바다향 코워킹', icon: '🌊', meta: '강원 강릉 · 코워킹오피스', value: 85, delta: '2%', deltaType: 'up' },
  { name: '양양 파도소리 빌라', icon: '🌅', meta: '강원 양양 · 워크앤스테이', value: 82 },
  { name: '북촌 한옥 워크룸', icon: '🏯', meta: '서울 북촌 · 워크앤스테이', value: 78 },
  { name: '성수 브릭라운지', icon: '🧱', meta: '서울 성수 · 코워킹오피스', value: 76, delta: '6%', deltaType: 'up' },
  { name: '남해 올리브 팜스테이', icon: '🫒', meta: '경남 남해 · 숙소', value: 72 },
  { name: '경주 황남 한옥', icon: '🏛️', meta: '경북 경주 · 숙소', value: 68 },
  { name: '부산 광안 라운지', icon: '🌃', meta: '부산 광안리 · 코워킹오피스', value: 64 },
  { name: '하동 차밭 농가', icon: '🍃', meta: '경남 하동 · 워크앤스테이', value: 58 },
]

export default function SpaceStats() {
  const nav = useNavigate()
  const [period, setPeriod] = useState('30days')

  const totalSpaces = CATEGORY_DIST.reduce((s, d) => s + d.value, 0)

  return (
    <Page>
      <BackLink onClick={() => nav('/admin/dashboard')}>← 관리자 대시보드</BackLink>

      <Header>
        <Title>공간 통계</Title>
        <Description>등록된 공간 현황과 운영 지표를 분석하세요</Description>
      </Header>

      <StatsPeriodFilter
        selectedPeriod={period}
        onPeriodChange={setPeriod}
        startDate="2026.04.09"
        endDate="2026.05.08"
        onDownload={() => alert('공간 데이터 CSV 다운로드')}
      />

      <KPIGrid>
        <AdminKPICard
          label="총 공간"
          value={totalSpaces.toLocaleString()}
          unit="개"
          icon="🏠"
          delta="8개"
          deltaType="up"
          subText="이번 달 신규"
          highlight
        />
        <AdminKPICard
          label="활성 공간"
          value="398"
          unit="개"
          icon="✓"
          subText="전체의 95.7%"
        />
        <AdminKPICard
          label="평균 평점"
          value="4.6"
          unit="/ 5.0"
          icon="⭐"
          delta="0.1"
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
          subText="전월 대비"
        />
      </KPIGrid>

      <DonutGrid>
        <DonutChart
          title="카테고리별 공간"
          data={CATEGORY_DIST}
          totalLabel="총 공간"
          totalUnit="개"
          formatTotal={(v) => v.toLocaleString()}
        />
        <HorizontalBarChart
          title="지역별 공간 분포"
          data={REGIONS}
          formatValue={(v) => `${v}개`}
        />
      </DonutGrid>

      <ChartGap />

      <VerticalBarChart
        title="평점 분포"
        data={RATING_DIST}
        formatValue={(v) => `${v}개`}
      />

      <ChartGap />

      <RankingList
        title="점유율 TOP 10"
        items={TOP_OCCUPANCY}
        formatValue={(v) => `${v}%`}
      />
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

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`

const ChartGap = styled.div`
  height: var(--space-5);
`
