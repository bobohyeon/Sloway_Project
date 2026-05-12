import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { Tabs, EmptyState, Button } from '../../../pay_shared/components'
import { EventCard } from '../../components/user/EventCard'

const EVENTS = [
  {
    id: 1,
    eventName: '봄맞이 워케이션',
    emoji: '🌸',
    title: '봄맞이 워케이션 15% 할인',
    discountType: 'percent',
    discountValue: 15,
    category: '워크앤스테이',
    period: '2026.05.01 ~ 2026.05.31',
    daysLeft: 23,
    conditions: [
      '워크앤스테이 카테고리 전용',
      '최대 50,000원 할인',
      '발급 후 14일 이내 사용',
      '1인 1회 발급 가능',
    ],
    totalQuantity: 1000,
    issuedCount: 387,
    alreadyIssued: false,
  },
  {
    id: 2,
    eventName: '신규 회원',
    emoji: '✨',
    title: '신규 회원 5,000원 즉시 할인',
    discountType: 'amount',
    discountValue: 5000,
    period: '상시 진행',
    daysLeft: 999,
    conditions: [
      '가입 후 30일 이내 사용',
      '최소 결제 30,000원 이상',
      '전 카테고리 사용 가능',
      '신규 회원 한정',
    ],
    totalQuantity: 999999,
    issuedCount: 12458,
    alreadyIssued: true,
  },
  {
    id: 3,
    eventName: '주말 코워킹',
    emoji: '💼',
    title: '주말 코워킹 30% 할인',
    discountType: 'percent',
    discountValue: 30,
    category: '코워킹오피스',
    period: '2026.05.10 ~ 2026.05.19',
    daysLeft: 8,
    conditions: [
      '코워킹오피스 카테고리 전용',
      '주말(토·일) 이용 시 적용',
      '최대 20,000원 할인',
      '1인 2회까지 발급',
    ],
    totalQuantity: 500,
    issuedCount: 480,
    alreadyIssued: false,
  },
  {
    id: 4,
    eventName: '얼리버드',
    emoji: '🌅',
    title: '얼리버드 10,000원 할인',
    discountType: 'amount',
    discountValue: 10000,
    period: '2026.05.05 ~ 2026.05.13',
    daysLeft: 2,
    conditions: [
      '7일 이상 사전 예약 시 사용',
      '최소 결제 80,000원 이상',
      '전 카테고리 사용 가능',
      '1인 1회 발급 가능',
    ],
    totalQuantity: 300,
    issuedCount: 245,
    alreadyIssued: false,
  },
]

const ENDED_EVENTS = [
  {
    id: 101,
    eventName: '벚꽃 시즌',
    emoji: '🌸',
    title: '벚꽃 시즌 20% 할인',
    discountType: 'percent',
    discountValue: 20,
    category: '숙소',
    period: '2026.03.20 ~ 2026.04.10',
    daysLeft: -30,
    conditions: ['숙소 카테고리 전용', '최대 30,000원 할인'],
    totalQuantity: 800,
    issuedCount: 800,
    alreadyIssued: false,
  },
]

export default function EventList() {
  const nav = useNavigate()
  const [tab, setTab] = useState('ongoing')

  const handleIssue = (event) => {
    if (window.confirm(`"${event.title}" 쿠폰을 발급받으시겠어요?`)) {
      alert('쿠폰이 발급됐어요! 내 쿠폰함에서 확인하실 수 있어요.')
    }
  }

  const tabs = [
    { value: 'ongoing', label: '진행 중', count: EVENTS.length },
    { value: 'ended', label: '종료', count: ENDED_EVENTS.length },
  ]

  const visibleEvents = tab === 'ongoing' ? EVENTS : ENDED_EVENTS

  const urgentEvents = EVENTS.filter((e) => e.daysLeft <= 3)

  return (
    <PageWrapper>
      <Container>
      <Header>
        <TopRow>
          <div>
            <Title>🎁 이벤트 & 쿠폰</Title>
            <Description>진행 중인 혜택을 놓치지 마세요</Description>
          </div>
          <MyCouponBtn onClick={() => nav('/user/coupon')}>
            내 쿠폰함 →
          </MyCouponBtn>
        </TopRow>
      </Header>

      {urgentEvents.length > 0 && tab === 'ongoing' && (
        <UrgentBanner>
          <UrgentIcon>⏰</UrgentIcon>
          <UrgentText>
            <UrgentTitle>곧 종료되는 이벤트 {urgentEvents.length}개</UrgentTitle>
            <UrgentSub>3일 이내 종료되는 이벤트가 있어요</UrgentSub>
          </UrgentText>
        </UrgentBanner>
      )}

      <TabsWrap>
        <Tabs items={tabs} value={tab} onChange={setTab} />
      </TabsWrap>

      {visibleEvents.length === 0 ? (
        <EmptyState
          icon="🎁"
          title="진행 중인 이벤트가 없어요"
          description="새로운 이벤트를 기다려주세요"
        />
      ) : (
        <EventGrid>
          {visibleEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onIssue={handleIssue}
              ended={tab === 'ended'}
            />
          ))}
        </EventGrid>
      )}
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
  margin-bottom: var(--space-5);
`

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
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

const MyCouponBtn = styled.button`
  padding: 8px 14px;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  color: var(--gray-800);
  cursor: pointer;
  transition: all 160ms ease;

  &:hover {
    border-color: var(--sage);
    background: var(--cream);
  }
`

const UrgentBanner = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: rgba(184, 90, 78, 0.08);
  border: 1px solid rgba(184, 90, 78, 0.2);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-4);
`

const UrgentIcon = styled.span`
  font-size: 1.3rem;
  flex-shrink: 0;
`

const UrgentText = styled.div`
  flex: 1;
`

const UrgentTitle = styled.div`
  font-size: 0.92rem;
  font-weight: 600;
  color: #a04c42;
  margin-bottom: 2px;
`

const UrgentSub = styled.div`
  font-size: 0.78rem;
  color: var(--gray-600);
`

const TabsWrap = styled.div`
  margin-bottom: var(--space-4);
`

const EventGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`
