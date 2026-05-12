import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { Tabs, EmptyState, Pagination, Button } from '../../../pay_shared/components'
import { PointBalance } from '../../components/user/PointBalance'
import { PointExpiringSoon } from '../../components/user/PointExpiringSoon'
import { PointStatsRow } from '../../components/user/PointStatsRow'
import { PointHistoryItem } from '../../components/user/PointHistoryItem'
import { PointPolicyNotice } from '../../components/user/PointPolicyNotice'

const BALANCE = 2450
const PENDING_POINTS = 3240

const EXPIRING_ITEMS = [
  {
    amount: 800,
    reason: '2025.05.15 적립 (강릉 바다향 코워킹)',
    expireDate: '2026.05.15',
    daysLeft: 4,
  },
  {
    amount: 200,
    reason: '2025.05.28 적립 (성수 브릭라운지)',
    expireDate: '2026.05.28',
    daysLeft: 17,
  },
]

const TOTAL_EARNED = 5820
const TOTAL_USED = 2400
const TOTAL_EXPIRED = 970

const HISTORY = [
  {
    type: 'pending',
    title: '청평 숲속 파인뷰 스테이 결제',
    description: '이용 완료 후 7일 뒤 적립 예정',
    amount: 3240,
    at: '2026.05.08 14:32',
    balanceAfter: 2450,
  },
  {
    type: 'used',
    title: '청평 숲속 파인뷰 스테이 결제 시 사용',
    description: 'PAY-20260508-00921',
    amount: 2450,
    at: '2026.05.08 14:30',
    balanceAfter: 2450,
  },
  {
    type: 'earned',
    title: '강릉 바다향 코워킹 이용 완료',
    description: '결제액 1% 적립',
    amount: 240,
    at: '2026.05.06 09:14',
    balanceAfter: 4900,
  },
  {
    type: 'used',
    title: '성수 브릭라운지 결제 시 사용',
    description: 'PAY-20260503-00845',
    amount: 1200,
    at: '2026.05.03 18:22',
    balanceAfter: 4660,
  },
  {
    type: 'earned',
    title: '남해 올리브 팜스테이 이용 완료',
    description: '결제액 1% 적립',
    amount: 1820,
    at: '2026.04.28 12:05',
    balanceAfter: 5860,
  },
  {
    type: 'expired',
    title: '포인트 만료',
    description: '2025.03.18 적립분 365일 경과',
    amount: 450,
    at: '2026.03.18 00:00',
    balanceAfter: 4040,
  },
  {
    type: 'earned',
    title: '북촌 한옥 워크룸 이용 완료',
    description: '결제액 1% 적립',
    amount: 1280,
    at: '2026.04.20 16:30',
    balanceAfter: 4490,
  },
  {
    type: 'cancelled',
    title: '강릉 바다향 코워킹 결제 취소',
    description: '환불 처리 시 포인트 복원',
    amount: 240,
    at: '2026.04.15 11:20',
    balanceAfter: 3210,
  },
]

export default function PointHistory() {
  const nav = useNavigate()
  const [tab, setTab] = useState('all')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    if (tab === 'all') return HISTORY
    return HISTORY.filter((h) => h.type === tab)
  }, [tab])

  const tabs = [
    { value: 'all', label: '전체', count: HISTORY.length },
    { value: 'earned', label: '적립', count: HISTORY.filter((h) => h.type === 'earned').length },
    { value: 'used', label: '사용', count: HISTORY.filter((h) => h.type === 'used').length },
    { value: 'expired', label: '만료', count: HISTORY.filter((h) => h.type === 'expired').length },
  ]

  return (
    <PageWrapper>
      <Container>
      <BackLink onClick={() => nav('/user/mypage')}>← 마이페이지</BackLink>

      <Header>
        <Title>포인트</Title>
        <Description>적립된 포인트로 더 저렴하게 예약하세요</Description>
      </Header>

      <BalanceSection>
        <PointBalance balance={BALANCE} pendingPoints={PENDING_POINTS} />
      </BalanceSection>

      <ExpiringSection>
        <PointExpiringSoon
          items={EXPIRING_ITEMS}
          totalExpiring={EXPIRING_ITEMS.reduce((s, i) => s + i.amount, 0)}
        />
      </ExpiringSection>

      <StatsSection>
        <PointStatsRow
          totalEarned={TOTAL_EARNED}
          totalUsed={TOTAL_USED}
          totalExpired={TOTAL_EXPIRED}
        />
      </StatsSection>

      <PolicySection>
        <PointPolicyNotice />
      </PolicySection>

      <HistorySection>
        <SectionHeader>
          <SectionTitle>적립·사용 내역</SectionTitle>
        </SectionHeader>

        <TabsWrap>
          <Tabs items={tabs} value={tab} onChange={setTab} />
        </TabsWrap>

        {filtered.length === 0 ? (
          <EmptyState
            icon="🌱"
            title="내역이 없어요"
            description="해당 카테고리에 포인트 내역이 없습니다"
            action={
              <Button variant="secondary" onClick={() => setTab('all')}>
                전체 보기
              </Button>
            }
          />
        ) : (
          <List>
            {filtered.map((entry, i) => (
              <PointHistoryItem key={i} entry={entry} />
            ))}
          </List>
        )}

        <Pagination currentPage={page} totalPages={2} onChange={setPage} />
      </HistorySection>
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
  max-width: 800px;
  display: flex;
  flex-direction: column;
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

const BalanceSection = styled.div`
  margin-bottom: var(--space-4);
`

const ExpiringSection = styled.div`
  margin-bottom: var(--space-4);
`

const StatsSection = styled.div`
  margin-bottom: var(--space-5);
`

const PolicySection = styled.div`
  margin-bottom: var(--space-6);
`

const HistorySection = styled.div``

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
`

const SectionTitle = styled.h3`
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--gray-800);
`

const TabsWrap = styled.div`
  margin-bottom: var(--space-3);
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`
