import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import PageLayout from '../../../../app/layouts/page/PageLayout'

import { SettlementStatCard } from '../../components/host/SettlementStatCard'
import { SettlementSchedule } from '../../components/host/SettlementSchedule'
import { MonthlySalesChart } from '../../components/host/MonthlySalesChart'
import { RecentSettlementsTable } from '../../components/host/RecentSettlementsTable'
import { QuickActionCard } from '../../components/host/QuickActionCard'

const SCHEDULE = {
  periodStart: '2026.05.09',
  periodEnd: '2026.05.12',
  settlementDate: '2026.05.13',
  daysRemaining: 1,
}

const MONTHLY_SALES = [
  { month: '11월', amount: 3200000 },
  { month: '12월', amount: 4100000 },
  { month: '1월', amount: 3800000 },
  { month: '2월', amount: 4500000 },
  { month: '3월', amount: 4900000 },
  { month: '4월', amount: 5420000 },
  { month: '5월', amount: 2850000 },
]

const RECENT_SETTLEMENTS = [
  {
    id: 1,
    settlementDate: '2026.05.09',
    spaceName: '청평 숲속 파인뷰 스테이',
    spaceEmoji: '🌲',
    bookingCount: 4,
    amount: 1820000,
    status: 'completed',
  },
  {
    id: 2,
    settlementDate: '2026.05.05',
    spaceName: '청평 숲속 파인뷰 스테이',
    spaceEmoji: '🌲',
    bookingCount: 3,
    amount: 1360000,
    status: 'completed',
  },
  {
    id: 3,
    settlementDate: '2026.05.01',
    spaceName: '청평 숲속 파인뷰 스테이',
    spaceEmoji: '🌲',
    bookingCount: 5,
    amount: 2240000,
    status: 'completed',
  },
]

export default function SettlementDashboard() {
  const nav = useNavigate()

  const monthSales = MONTHLY_SALES[MONTHLY_SALES.length - 1].amount
  const lastMonth = MONTHLY_SALES[MONTHLY_SALES.length - 2].amount
  const expected = Math.floor(monthSales * 0.875)
  const totalPaid = RECENT_SETTLEMENTS.reduce((s, x) => s + x.amount, 0)
  const totalSales = MONTHLY_SALES.reduce((s, x) => s + x.amount, 0)

  return (
    <PageLayout
      title="정산 대시보드"
      description="이번 달 매출과 정산 예정 금액을 확인하세요"
      maxWidth={1200}
    >

      <StatGrid>
        <SettlementStatCard
          icon="💰"
          label="이번 달 매출"
          value={monthSales.toLocaleString()}
          delta={`${(((monthSales - lastMonth) / lastMonth) * 100).toFixed(1)}%`}
          deltaType="up"
          subText="전월 대비"
          highlight
        />
        <SettlementStatCard
          icon="📅"
          label="정산 예정"
          value={expected.toLocaleString()}
          subText="6월 5일 입금"
        />
        <SettlementStatCard
          icon="✓"
          label="이미 정산 완료"
          value={totalPaid.toLocaleString()}
          subText="지난 3개월 누적"
        />
        <SettlementStatCard
          icon="📊"
          label="총 매출"
          value={totalSales.toLocaleString()}
          subText="누적 매출"
        />
      </StatGrid>

      <ScheduleWrap>
        <SettlementSchedule
          periodStart={SCHEDULE.periodStart}
          periodEnd={SCHEDULE.periodEnd}
          settlementDate={SCHEDULE.settlementDate}
          daysRemaining={SCHEDULE.daysRemaining}
        />
      </ScheduleWrap>

      <MonthlySalesChart data={MONTHLY_SALES} />

      <RecentSettlementsTable
        items={RECENT_SETTLEMENTS}
        onSeeAll={() => nav('/host/settlement/history')}
        onClickItem={(item) => nav(`/host/settlement/history/${item.id}`)}
      />

      <QuickActionsSection>
        <QuickActionsTitle>빠른 안내</QuickActionsTitle>
        <QuickGrid>
          <QuickActionCard
            icon="🏦"
            title="정산 계좌 관리"
            description="입금 받을 계좌를 등록·변경하세요"
            onClick={() => nav('/host/settlement/account')}
          />
          <QuickActionCard
            icon="📑"
            title="수수료 정책"
            description="현재 적용되는 수수료를 확인하세요"
            onClick={() => nav('/host/settlement/fee')}
          />
          <QuickActionCard
            icon="🧾"
            title="세금계산서"
            description="발행 내역 및 다운로드"
            onClick={() => nav('/host/settlement/tax')}
          />
        </QuickGrid>
      </QuickActionsSection>
    </PageLayout>
  )
}
const StatGrid = styled.div`
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

const ScheduleWrap = styled.div`
  margin-bottom: var(--space-6);
`

const QuickActionsSection = styled.div`
  margin-top: var(--space-6);
`

const QuickActionsTitle = styled.h3`
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: var(--space-3);
`

const QuickGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`
