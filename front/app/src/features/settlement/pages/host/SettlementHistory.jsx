import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import PageLayout from '../../../../app/layouts/page/PageLayout'

import { Pagination, EmptyState, Button } from '../../../pay_shared/components'
import { SettlementStatCard } from '../../components/host/SettlementStatCard'
import { SettlementCard } from '../../components/host/SettlementCard'
import { SettlementFilterBar } from '../../components/host/SettlementFilterBar'

const SETTLEMENTS = [
  {
    id: 1,
    settlementDate: '2026.05.13',
    spaceName: '청평 숲속 파인뷰 스테이',
    spaceEmoji: '🌲',
    spaceId: 1,
    bookingCount: 5,
    salesAmount: 2780000,
    feeRate: 12.5,
    feeAmount: 347500,
    payoutAmount: 2432500,
    status: 'scheduled',
  },
  {
    id: 2,
    settlementDate: '2026.05.09',
    spaceName: '청평 숲속 파인뷰 스테이',
    spaceEmoji: '🌲',
    spaceId: 1,
    bookingCount: 4,
    salesAmount: 2080000,
    feeRate: 12.5,
    feeAmount: 260000,
    payoutAmount: 1820000,
    status: 'completed',
  },
  {
    id: 3,
    settlementDate: '2026.05.05',
    spaceName: '청평 숲속 파인뷰 스테이',
    spaceEmoji: '🌲',
    spaceId: 1,
    bookingCount: 3,
    salesAmount: 1554000,
    feeRate: 12.5,
    feeAmount: 194000,
    payoutAmount: 1360000,
    status: 'completed',
  },
  {
    id: 4,
    settlementDate: '2026.05.01',
    spaceName: '강릉 바다향 코워킹',
    spaceEmoji: '🌊',
    spaceId: 2,
    bookingCount: 8,
    salesAmount: 980000,
    feeRate: 10,
    feeAmount: 98000,
    payoutAmount: 882000,
    status: 'completed',
  },
  {
    id: 5,
    settlementDate: '2026.04.27',
    spaceName: '청평 숲속 파인뷰 스테이',
    spaceEmoji: '🌲',
    spaceId: 1,
    bookingCount: 6,
    salesAmount: 3360000,
    feeRate: 12.5,
    feeAmount: 420000,
    payoutAmount: 2940000,
    status: 'completed',
  },
]

const SPACES = [
  { id: 1, name: '청평 숲속 파인뷰 스테이' },
  { id: 2, name: '강릉 바다향 코워킹' },
]

export default function SettlementHistory() {
  const nav = useNavigate()
  const [tab, setTab] = useState('all')
  const [period, setPeriod] = useState('6months')
  const [space, setSpace] = useState('all')
  const [page, setPage] = useState(1)

  const filtered = SETTLEMENTS.filter((s) => {
    if (tab !== 'all' && s.status !== tab) return false
    if (space !== 'all' && String(s.spaceId) !== space) return false
    return true
  })

  const totalPayout = SETTLEMENTS.filter((s) => s.status === 'completed').reduce(
    (sum, s) => sum + s.payoutAmount,
    0
  )
  const monthPayout = SETTLEMENTS.filter(
    (s) => s.status === 'completed' && s.settlementDate.startsWith('2026.05')
  ).reduce((sum, s) => sum + s.payoutAmount, 0)
  const expectedPayout = SETTLEMENTS.filter((s) => s.status === 'scheduled').reduce(
    (sum, s) => sum + s.payoutAmount,
    0
  )

  const tabs = [
    { value: 'all', label: '전체', count: SETTLEMENTS.length },
    {
      value: 'completed',
      label: '완료',
      count: SETTLEMENTS.filter((s) => s.status === 'completed').length,
    },
    {
      value: 'scheduled',
      label: '예정',
      count: SETTLEMENTS.filter((s) => s.status === 'scheduled').length,
    },
  ]

  return (
    <PageLayout
      title="정산 내역"
      description="모든 정산 내역을 확인하고 정산서를 다운로드하세요"
      maxWidth={1200}
    >

      <StatGrid>
        <SettlementStatCard
          icon="💰"
          label="총 정산 금액"
          value={totalPayout.toLocaleString()}
          subText="누적"
          highlight
        />
        <SettlementStatCard
          icon="✓"
          label="이번 달 정산"
          value={monthPayout.toLocaleString()}
          subText="2026년 4월"
        />
        <SettlementStatCard
          icon="📅"
          label="지급 예정"
          value={expectedPayout.toLocaleString()}
          subText="6월 5일 입금 예정"
        />
      </StatGrid>

      <SettlementFilterBar
        tabs={tabs}
        selectedTab={tab}
        onTabChange={setTab}
        selectedPeriod={period}
        onPeriodChange={setPeriod}
        selectedSpace={space}
        onSpaceChange={setSpace}
        spaces={SPACES}
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon="📋"
          title="해당 조건에 정산 내역이 없어요"
          description="필터를 변경하시거나 다른 기간을 선택해보세요"
          action={
            <Button
              variant="secondary"
              onClick={() => {
                setTab('all')
                setSpace('all')
                setPeriod('6months')
              }}
            >
              필터 초기화
            </Button>
          }
        />
      ) : (
        <List>
          {filtered.map((s) => (
            <SettlementCard
              key={s.id}
              settlement={s}
              onClick={(item) => nav(`/host/settlement/history/${item.id}`)}
              onDownload={(item) => alert(`정산서 다운로드: ${item.settlementDate}`)}
            />
          ))}
        </List>
      )}

      <Pagination currentPage={page} totalPages={2} onChange={setPage} />
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
const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
  margin-bottom: var(--space-5);

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`
