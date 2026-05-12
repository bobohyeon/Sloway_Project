import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { StatCard, EmptyState, Pagination, Button } from '../../../pay_shared/components'
import { PaymentListItem } from '../../components/user/PaymentListItem'
import { PaymentFilterBar } from '../../components/user/PaymentFilterBar'

const PAYMENTS = [
  {
    id: 'PAY-20260424-847',
    space: '청평 숲속 파인뷰 스테이',
    emoji: '🌲',
    method: '카카오페이',
    methodIcon: '💬',
    amount: 326500,
    paidAt: '2026.04.24 14:32',
    status: 'completed',
  },
  {
    id: 'PAY-20260418-623',
    space: '성수 브릭라운지',
    emoji: '🧱',
    method: '카카오페이',
    methodIcon: '💬',
    amount: 28000,
    paidAt: '2026.04.18 09:14',
    status: 'completed',
  },
  {
    id: 'PAY-20260402-412',
    space: '강릉 바다향 커먼워크',
    emoji: '🌊',
    method: '신용카드',
    methodIcon: '💳',
    amount: 28000,
    paidAt: '2026.04.02 11:23',
    status: 'completed',
  },
  {
    id: 'PAY-20260320-218',
    space: '남해 올리브 팜스테이',
    emoji: '🫒',
    method: '네이버페이',
    methodIcon: 'N',
    amount: 330000,
    paidAt: '2026.03.20 20:45',
    status: 'refunded',
  },
  {
    id: 'PAY-20260215-185',
    space: '성수 브릭라운지',
    emoji: '🧱',
    method: '토스페이',
    methodIcon: 'T',
    amount: 28000,
    paidAt: '2026.02.15 15:30',
    status: 'refunded',
  },
  {
    id: 'PAY-20260110-088',
    space: '양양 파도소리 빌라',
    emoji: '🌅',
    method: '카카오페이',
    methodIcon: '💬',
    amount: 240000,
    paidAt: '2026.01.10 12:00',
    status: 'failed',
  },
]

export default function PaymentHistory() {
  const nav = useNavigate()
  const [tab, setTab] = useState('all')
  const [period, setPeriod] = useState('month')
  const [page, setPage] = useState(1)

  const filtered = PAYMENTS.filter((p) => tab === 'all' || p.status === tab)

  const totalCompleted = PAYMENTS.filter((p) => p.status === 'completed').reduce(
    (s, p) => s + p.amount,
    0
  )
  const totalRefunded = PAYMENTS.filter((p) => p.status === 'refunded').reduce(
    (s, p) => s + p.amount,
    0
  )
  const realPaid = totalCompleted - totalRefunded

  const tabs = [
    { value: 'all', label: '전체', count: PAYMENTS.length },
    { value: 'completed', label: '결제 완료', count: PAYMENTS.filter((p) => p.status === 'completed').length },
    { value: 'refunded', label: '환불', count: PAYMENTS.filter((p) => p.status === 'refunded').length },
    { value: 'failed', label: '결제 실패', count: PAYMENTS.filter((p) => p.status === 'failed').length },
  ]

  return (
    <PageWrapper>
      <Container>
      <Header>
        <Title>결제 내역</Title>
        <Description>지금까지의 모든 결제 내역을 확인하실 수 있어요</Description>
      </Header>

      <StatGrid>
        <StatCard label="총 결제" value={PAYMENTS.length} unit="건" icon="💳" />
        <StatCard
          label="결제 완료 금액"
          value={totalCompleted.toLocaleString()}
          unit="원"
          icon="✓"
          highlight
        />
        <StatCard label="환불 금액" value={totalRefunded.toLocaleString()} unit="원" icon="↩️" />
        <StatCard label="실결제" value={realPaid.toLocaleString()} unit="원" icon="🌱" />
      </StatGrid>

      <PaymentFilterBar
        tabs={tabs}
        selectedTab={tab}
        onTabChange={setTab}
        selectedPeriod={period}
        onPeriodChange={setPeriod}
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon="🌱"
          title="결제 내역이 없어요"
          description="아직 이 카테고리에 해당하는 결제가 없습니다."
          action={
            <Button variant="primary" onClick={() => nav('/spaces/search')}>
              공간 둘러보기
            </Button>
          }
        />
      ) : (
        <List>
          {filtered.map((p) => (
            <PaymentListItem
              key={p.id}
              payment={p}
              onClick={(payment) => nav(`/user/payment/${payment.id}`)}
              onReceiptClick={(payment) => nav(`/user/payment/${payment.id}`)}
            />
          ))}
        </List>
      )}

      <Pagination currentPage={page} totalPages={2} onChange={setPage} />
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
  margin-bottom: 6px;
`

const Description = styled.p`
  font-size: 0.9rem;
  color: var(--gray-600);
`

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-3);
  margin-bottom: var(--space-6);

  @media (max-width: 720px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`
