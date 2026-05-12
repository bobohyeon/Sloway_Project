import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import PageLayout from '../../../../app/layouts/page/PageLayout'

import { AdminKPICard } from '../../../dashboard/components/admin/AdminKPICard'
import { DonutChart } from '../../../dashboard/components/admin/DonutChart'
import { StatsPeriodFilter } from '../../components/admin/StatsPeriodFilter'
import { VerticalBarChart } from '../../components/admin/VerticalBarChart'

const WEEKDAY_BOOKINGS = [
  { label: '월', value: 28 },
  { label: '화', value: 32 },
  { label: '수', value: 38 },
  { label: '목', value: 42 },
  { label: '금', value: 58, highlight: true },
  { label: '토', value: 65, highlight: true },
  { label: '일', value: 48 },
]

const HOUR_CHECKINS = [
  { label: '10시', value: 8 },
  { label: '11시', value: 12 },
  { label: '12시', value: 18 },
  { label: '13시', value: 24 },
  { label: '14시', value: 38, highlight: true },
  { label: '15시', value: 52, highlight: true },
  { label: '16시', value: 48, highlight: true },
  { label: '17시', value: 28 },
  { label: '18시', value: 14 },
  { label: '19시', value: 6 },
]

const CANCEL_REASONS = [
  { label: '일정 변경', value: 42, color: '#7A8B71' },
  { label: '다른 공간으로 변경', value: 18, color: '#A8B89F' },
  { label: '건강상 이유', value: 14, color: '#C5D1BD' },
  { label: '개인 사정', value: 12, color: '#E2E8DC' },
  { label: '가격 부담', value: 8, color: '#D4861F' },
  { label: '기타', value: 6, color: '#B85A4E' },
]

const STATUS_DIST = [
  { label: '완료', value: 248, color: '#7A8B71' },
  { label: '진행 중', value: 32, color: '#A8B89F' },
  { label: '취소', value: 18, color: '#B85A4E' },
  { label: '환불', value: 12, color: '#C5D1BD' },
]

export default function BookingStats() {
  const nav = useNavigate()
  const [period, setPeriod] = useState('30days')

  const total = 310
  const completed = 248
  const cancelled = 18 + 12
  const cancelRate = ((cancelled / total) * 100).toFixed(1)

  return (
    <PageLayout
      title="예약 통계"
      description="예약 현황과 패턴을 분석하세요"
      maxWidth={1200}
    >

      <StatsPeriodFilter
        selectedPeriod={period}
        onPeriodChange={setPeriod}
        startDate="2026.04.09"
        endDate="2026.05.08"
        onDownload={() => alert('예약 데이터 CSV 다운로드')}
      />

      <KPIGrid>
        <AdminKPICard
          label="총 예약"
          value={total.toLocaleString()}
          unit="건"
          icon="📅"
          delta="14%"
          deltaType="up"
          subText="전월 대비"
          highlight
        />
        <AdminKPICard
          label="완료된 예약"
          value={completed.toLocaleString()}
          unit="건"
          icon="✓"
          subText={`완료율 ${((completed / total) * 100).toFixed(1)}%`}
        />
        <AdminKPICard
          label="취소·환불"
          value={cancelled.toLocaleString()}
          unit="건"
          icon="↩️"
          subText={`취소율 ${cancelRate}%`}
        />
        <AdminKPICard
          label="평균 체류"
          value="2.4"
          unit="박"
          icon="🏠"
          delta="0.2박"
          deltaType="up"
          subText="전월 대비"
        />
      </KPIGrid>

      <VerticalBarChart
        title="요일별 예약 분포"
        data={WEEKDAY_BOOKINGS}
        formatValue={(v) => `${v}건`}
      />

      <ChartGap />

      <VerticalBarChart
        title="시간대별 체크인 분포"
        data={HOUR_CHECKINS}
        formatValue={(v) => `${v}건`}
      />

      <DonutGrid>
        <DonutChart
          title="예약 상태 분포"
          data={STATUS_DIST}
          totalLabel="총 예약"
          totalUnit="건"
          formatTotal={(v) => v.toLocaleString()}
        />
        <DonutChart
          title="취소 사유 분석"
          data={CANCEL_REASONS}
          totalLabel="총 취소"
          totalUnit="건"
          formatTotal={(v) => v.toLocaleString()}
        />
      </DonutGrid>
    </PageLayout>
  )
}
const BackLink = styled.button`
  font-size: 0.85rem;
  color: var(--gray-600);
  margin-bottom: var(--space-4);

  &:hover {
    color: var(--gray-800);
  }
`
const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-3);
  margin-bottom: var(--space-5);

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`

const ChartGap = styled.div`
  height: var(--space-5);
`

const DonutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
  margin-top: var(--space-5);

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`
