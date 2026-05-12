import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { Pagination, EmptyState, Button } from '../../../pay_shared/components'
import { SettlementStatCard } from '../../../settlement/components/host/SettlementStatCard'
import { RefundRequestCard } from '../../components/admin/RefundRequestCard'
import { RefundFilterBar } from '../../components/admin/RefundFilterBar'

const REFUND_REQUESTS = [
  {
    id: 1,
    refundId: 'RFD-20260508-00921',
    userName: '박지수',
    spaceName: '강릉 바다향 코워킹',
    spaceEmoji: '🌊',
    method: '카카오페이',
    paidAmount: 290000,
    refundAmount: 290000,
    rate: 100,
    requestedAt: '2026.05.08 09:14',
    completedAt: null,
    status: 'failed',
    isHostRejected: false,
    alertMessage: 'PG사 송금 실패 - 자동 재처리 대기',
  },
  {
    id: 2,
    refundId: 'RFD-20260507-00918',
    userName: '김도현',
    spaceName: '청평 숲속 파인뷰 스테이',
    spaceEmoji: '🌲',
    method: '네이버페이',
    paidAmount: 540000,
    refundAmount: 540000,
    rate: 100,
    requestedAt: '2026.05.07 18:22',
    completedAt: '2026.05.07 19:30',
    status: 'completed',
    isHostRejected: true,
    alertMessage: null,
  },
  {
    id: 3,
    refundId: 'RFD-20260507-00917',
    userName: '최민서',
    spaceName: '청평 숲속 파인뷰 스테이',
    spaceEmoji: '🌲',
    method: '카카오페이',
    paidAmount: 510000,
    refundAmount: 255000,
    rate: 50,
    requestedAt: '2026.05.07 14:05',
    completedAt: '2026.05.08 10:23',
    status: 'completed',
    isHostRejected: false,
  },
  {
    id: 4,
    refundId: 'RFD-20260506-00912',
    userName: '정유나',
    spaceName: '강릉 바다향 코워킹',
    spaceEmoji: '🌊',
    method: '토스페이',
    paidAmount: 880000,
    refundAmount: 264000,
    rate: 30,
    requestedAt: '2026.05.06 21:38',
    completedAt: '2026.05.07 11:12',
    status: 'completed',
    isHostRejected: false,
  },
  {
    id: 5,
    refundId: 'RFD-20260424-00847',
    userName: '김우영',
    spaceName: '청평 숲속 파인뷰 스테이',
    spaceEmoji: '🌲',
    method: '카카오페이',
    paidAmount: 326500,
    refundAmount: 326500,
    rate: 100,
    requestedAt: '2026.04.24 14:32',
    completedAt: '2026.04.29 09:30',
    status: 'completed',
    isHostRejected: false,
  },
]

export default function RefundList() {
  const nav = useNavigate()
  const [tab, setTab] = useState('all')
  const [period, setPeriod] = useState('month')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = REFUND_REQUESTS.filter((r) => {
    if (tab === 'abnormal' && r.status !== 'failed') return false
    if (tab === 'host_rejected' && !r.isHostRejected) return false
    if (tab !== 'all' && tab !== 'abnormal' && tab !== 'host_rejected' && r.status !== tab) return false
    if (search && !r.userName.includes(search) && !r.refundId.includes(search)) return false
    return true
  })

  const total = REFUND_REQUESTS.length
  const processing = REFUND_REQUESTS.filter((r) => r.status === 'processing').length
  const completed = REFUND_REQUESTS.filter((r) => r.status === 'completed').length
  const abnormal = REFUND_REQUESTS.filter((r) => r.status === 'failed').length

  const tabs = [
    { value: 'all', label: '전체', count: total },
    { value: 'completed', label: '완료', count: completed },
    { value: 'abnormal', label: '송금실패', count: abnormal },
    { value: 'host_rejected', label: '호스트거절', count: REFUND_REQUESTS.filter((r) => r.isHostRejected).length },
  ]

  return (
    <PageWrapper>
      <Container>
      <Header>
        <Title>환불 관리</Title>
        <Description>모든 환불 요청을 모니터링하고 예외 케이스를 확인하세요</Description>
      </Header>

      <StatGrid>
        <SettlementStatCard
          icon="📊"
          label="총 환불 요청"
          value={total.toLocaleString()}
          unit="건"
          subText="누적"
        />
        <SettlementStatCard
          icon="⏳"
          label="처리 중"
          value={processing.toLocaleString()}
          unit="건"
          subText="자동 처리 중"
        />
        <SettlementStatCard
          icon="✓"
          label="처리 완료"
          value={completed.toLocaleString()}
          unit="건"
          subText="환불 완료"
        />
        <SettlementStatCard
          icon="⚠️"
          label="송금 실패"
          value={abnormal.toLocaleString()}
          unit="건"
          subText="자동 재시도 대기"
          highlight={abnormal > 0}
        />
      </StatGrid>

      <RefundFilterBar
        tabs={tabs}
        selectedTab={tab}
        onTabChange={setTab}
        selectedPeriod={period}
        onPeriodChange={setPeriod}
        searchQuery={search}
        onSearchChange={setSearch}
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon="📋"
          title="해당 조건에 환불 요청이 없어요"
          description="필터를 변경하시거나 다른 기간을 선택해보세요"
          action={
            <Button
              variant="secondary"
              onClick={() => {
                setTab('all')
                setPeriod('month')
                setSearch('')
              }}
            >
              필터 초기화
            </Button>
          }
        />
      ) : (
        <List>
          {filtered.map((r) => (
            <RefundRequestCard
              key={r.id}
              request={r}
              onClick={(item) => nav(`/admin/refund/${item.id}`)}
            />
          ))}
        </List>
      )}

      <Pagination currentPage={page} totalPages={1} onChange={setPage} />
    </Container>
    </PageWrapper>
  )
}

const PageWrapper = styled.div`
  background-color: var(--cream);
  min-height: 100%;
  padding: var(--space-6) var(--space-5);
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  animation: fadeInUp 480ms ease-out both;
`

const Header = styled.div`
  margin-bottom: var(--space-6);
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

const StatGrid = styled.div`
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

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`
