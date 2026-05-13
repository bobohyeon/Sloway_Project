import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import PageLayout from '../../../../app/layouts/page/PageLayout'

import { Tabs, EmptyState, Button } from '../../../pay_shared/components'
import { CouponTicket } from '../../components/user/CouponTicket'
import { CouponCodeInput } from '../../components/user/CouponCodeInput'

const COUPONS = [
  {
    id: 1,
    title: '봄맞이 워케이션 15% 할인',
    discountType: 'percent',
    discountValue: 15,
    expireDate: '2026.05.31',
    daysLeft: 23,
    maxDiscount: 50000,
    minPayment: 100000,
    category: '워크앤스테이',
    scope: '전체 공간',
    status: 'available',
  },
  {
    id: 2,
    title: '신규 회원 5,000원 할인',
    discountType: 'amount',
    discountValue: 5000,
    expireDate: '2026.05.20',
    daysLeft: 12,
    minPayment: 30000,
    category: '전 카테고리',
    scope: '신규 회원',
    status: 'available',
  },
  {
    id: 3,
    title: '얼리버드 10,000원 할인',
    discountType: 'amount',
    discountValue: 10000,
    expireDate: '2026.05.13',
    daysLeft: 5,
    minPayment: 80000,
    category: '전 카테고리',
    scope: '7일 이상 사전 예약',
    status: 'available',
  },
  {
    id: 4,
    title: '주말 코워킹 30% 할인',
    discountType: 'percent',
    discountValue: 30,
    expireDate: '2026.05.19',
    daysLeft: 11,
    maxDiscount: 20000,
    category: '코워킹오피스',
    scope: '주말 한정',
    status: 'available',
  },
  {
    id: 5,
    title: '추석맞이 20% 할인',
    discountType: 'percent',
    discountValue: 20,
    expireDate: '2025.09.20',
    daysLeft: -50,
    maxDiscount: 40000,
    category: '숙소',
    status: 'used',
    usedAt: '2025.09.15',
    usedFor: '청평 숲속 파인뷰 스테이',
  },
  {
    id: 6,
    title: '연말 특가 5,000원 할인',
    discountType: 'amount',
    discountValue: 5000,
    expireDate: '2025.12.31',
    daysLeft: -100,
    category: '전 카테고리',
    status: 'used',
    usedAt: '2025.12.20',
    usedFor: '강릉 바다향 코워킹',
  },
  {
    id: 7,
    title: '벚꽃 시즌 20% 할인',
    discountType: 'percent',
    discountValue: 20,
    expireDate: '2026.04.10',
    daysLeft: -30,
    maxDiscount: 30000,
    category: '숙소',
    status: 'expired',
  },
  {
    id: 8,
    title: '체험 1,000원 할인',
    discountType: 'amount',
    discountValue: 1000,
    expireDate: '2026.03.15',
    daysLeft: -55,
    category: '전 카테고리',
    status: 'expired',
  },
]

export default function MyCoupons() {
  const nav = useNavigate()
  const [tab, setTab] = useState('available')

  const filtered = useMemo(() => {
    return COUPONS.filter((c) => c.status === tab).sort((a, b) => {
      if (tab === 'available') return a.daysLeft - b.daysLeft
      return 0
    })
  }, [tab])

  const availableCount = COUPONS.filter((c) => c.status === 'available').length
  const usedCount = COUPONS.filter((c) => c.status === 'used').length
  const expiredCount = COUPONS.filter((c) => c.status === 'expired').length

  const expiringSoon = COUPONS.filter((c) => c.status === 'available' && c.daysLeft <= 7).length

  const tabs = [
    { value: 'available', label: '사용 가능', count: availableCount },
    { value: 'used', label: '사용 완료', count: usedCount },
    { value: 'expired', label: '만료', count: expiredCount },
  ]

  const handleUse = (coupon) => {
    if (window.confirm(`"${coupon.title}"을(를) 사용하시겠어요?\n예약 페이지로 이동합니다.`)) {
      nav('/user/booking?coupon=' + coupon.id)
    }
  }

  const handleCodeSubmit = (code) => {
    alert(`쿠폰 코드 "${code}" 확인 중...\n유효한 코드라면 쿠폰함에 추가돼요.`)
  }

  return (
    <PageLayout
      title="내 쿠폰함"
      description="받은 쿠폰을 한눈에 확인하고 사용하세요"
      actions={
        <EventBtn onClick={() => nav('/event')}>
          🎁 이벤트 보러가기 →
        </EventBtn>
      }
      maxWidth={1200}
    >

      <CouponCodeInput onSubmit={handleCodeSubmit} />

      {expiringSoon > 0 && tab === 'available' && (
        <ExpireBanner>
          <span>⏰</span>
          <span>
            <strong>{expiringSoon}개</strong>의 쿠폰이 7일 이내 만료돼요. 만료 전 사용하세요!
          </span>
        </ExpireBanner>
      )}

      <TabsWrap>
        <Tabs items={tabs} value={tab} onChange={setTab} />
      </TabsWrap>

      {filtered.length === 0 ? (
        <EmptyState
          icon={tab === 'available' ? '🎟️' : tab === 'used' ? '✓' : '⌛'}
          title={
            tab === 'available'
              ? '사용 가능한 쿠폰이 없어요'
              : tab === 'used'
              ? '사용한 쿠폰이 없어요'
              : '만료된 쿠폰이 없어요'
          }
          description={
            tab === 'available'
              ? '이벤트 페이지에서 쿠폰을 받아보세요'
              : '쿠폰을 사용하면 여기에 표시돼요'
          }
          action={
            tab === 'available' && (
              <Button variant="primary" onClick={() => nav('/event')}>
                🎁 이벤트 보러가기
              </Button>
            )
          }
        />
      ) : (
        <CouponGrid>
          {filtered.map((coupon) => (
            <CouponTicket
              key={coupon.id}
              coupon={coupon}
              status={coupon.status}
              onUse={handleUse}
            />
          ))}
        </CouponGrid>
      )}
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
const EventBtn = styled.button`
  padding: 8px 14px;
  background: var(--sage);
  color: var(--white);
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 160ms ease;

  &:hover {
    background: #6b7d62;
    transform: translateY(-1px);
  }
`

const ExpireBanner = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 10px var(--space-3);
  background: rgba(184, 90, 78, 0.08);
  border: 1px solid rgba(184, 90, 78, 0.2);
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  color: var(--gray-800);
  margin: var(--space-3) 0;

  strong {
    color: #a04c42;
    font-weight: 700;
  }
`

const TabsWrap = styled.div`
  margin: var(--space-4) 0;
`

const CouponGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`
