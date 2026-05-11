import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'

import { Card, Button, Badge } from '../../../pay_shared/components'
import { ReceiptHeader } from '../../components/user/ReceiptHeader'
import { PaymentDetailCard } from '../../components/user/PaymentDetailCard'
import { PriceBreakdown } from '../../components/user/PriceBreakdown'

const PAYMENTS = [
  {
    id: 'PAY-20260424-847',
    bookingId: 'SW-20260508-000847',
    status: 'completed',
    paidAt: '2026.04.24 14:32',
    method: '카카오페이',
    methodIcon: '💬',
    pg: 'KG이니시스',
    approvalNo: 'KP-20260424-00512847',
    cardInfo: '신한 ****-1234',
    installments: '일시불',
    space: {
      name: '청평 숲속 파인뷰 스테이',
      type: '워크앤스테이',
      loc: '경기 가평',
      emoji: '🌲',
      dates: '5월 8일 (목) ~ 5월 10일 (토) · 2박',
      guests: '성인 2명',
    },
    priceItems: [
      { label: '185,000원 × 2박', amount: 370000 },
      { label: '서비스 수수료', amount: 12000 },
      { label: '🎟️ 봄맞이 워케이션 15% 할인', amount: 55500, type: 'discount' },
      { label: '🌱 포인트 사용', amount: 2450, type: 'discount' },
    ],
    total: 324050,
    earnPoints: 3240,
  },
  {
    id: 'PAY-20260418-623',
    bookingId: 'SW-20260418-000623',
    status: 'completed',
    paidAt: '2026.04.18 09:14',
    method: '카카오페이',
    methodIcon: '💬',
    pg: 'KG이니시스',
    approvalNo: 'KP-20260418-00478623',
    cardInfo: '신한 ****-1234',
    installments: '일시불',
    space: {
      name: '성수 브릭라운지',
      type: '코워킹오피스',
      loc: '서울 성수',
      emoji: '🧱',
      dates: '4월 26일 (금) 14:00 ~ 18:00 · 4시간',
      guests: '성인 1명',
    },
    priceItems: [
      { label: '7,000원 × 4시간', amount: 28000 },
    ],
    total: 28000,
    earnPoints: 280,
  },
  {
    id: 'PAY-20260402-412',
    bookingId: 'SW-20260402-000412',
    status: 'completed',
    paidAt: '2026.04.02 11:23',
    method: '신용카드',
    methodIcon: '💳',
    pg: 'KG이니시스',
    approvalNo: 'CC-20260402-00318412',
    cardInfo: '국민 ****-5678',
    installments: '일시불',
    space: {
      name: '강릉 바다향 커먼워크',
      type: '코워킹오피스',
      loc: '강원 강릉',
      emoji: '🌊',
      dates: '4월 5일 (토) 10:00 ~ 14:00 · 4시간',
      guests: '성인 1명',
    },
    priceItems: [
      { label: '7,000원 × 4시간', amount: 28000 },
    ],
    total: 28000,
    earnPoints: 280,
  },
  {
    id: 'PAY-20260320-218',
    bookingId: 'SW-20260320-000218',
    status: 'refunded',
    paidAt: '2026.03.20 20:45',
    method: '네이버페이',
    methodIcon: 'N',
    pg: '네이버페이',
    approvalNo: 'NP-20260320-00218',
    cardInfo: '네이버페이 머니',
    installments: '일시불',
    space: {
      name: '남해 올리브 팜스테이',
      type: '숙소',
      loc: '경남 남해',
      emoji: '🫒',
      dates: '4월 1일 (수) ~ 4월 3일 (금) · 2박',
      guests: '성인 2명',
    },
    priceItems: [
      { label: '165,000원 × 2박', amount: 330000 },
    ],
    total: 330000,
    earnPoints: 0,
  },
  {
    id: 'PAY-20260215-185',
    bookingId: 'SW-20260215-000185',
    status: 'refunded',
    paidAt: '2026.02.15 15:30',
    method: '토스페이',
    methodIcon: 'T',
    pg: '토스페이먼츠',
    approvalNo: 'TP-20260215-00185',
    cardInfo: '토스 머니',
    installments: '일시불',
    space: {
      name: '성수 브릭라운지',
      type: '코워킹오피스',
      loc: '서울 성수',
      emoji: '🧱',
      dates: '2월 20일 (목) 13:00 ~ 17:00 · 4시간',
      guests: '성인 1명',
    },
    priceItems: [
      { label: '7,000원 × 4시간', amount: 28000 },
    ],
    total: 28000,
    earnPoints: 0,
  },
  {
    id: 'PAY-20260110-088',
    bookingId: 'SW-20260110-000088',
    status: 'failed',
    paidAt: '2026.01.10 12:00',
    method: '카카오페이',
    methodIcon: '💬',
    pg: 'KG이니시스',
    approvalNo: '-',
    cardInfo: '카카오페이 머니',
    installments: '-',
    space: {
      name: '양양 파도소리 빌라',
      type: '숙소',
      loc: '강원 양양',
      emoji: '🌅',
      dates: '1월 18일 (토) ~ 1월 20일 (월) · 2박',
      guests: '성인 2명',
    },
    priceItems: [
      { label: '120,000원 × 2박', amount: 240000 },
    ],
    total: 240000,
    earnPoints: 0,
  },
]

export default function PaymentDetail() {
  const nav = useNavigate()
  const { id } = useParams()

  // ID로 결제 찾기 (없으면 첫 번째)
  const payment = PAYMENTS.find((p) => p.id === id) || PAYMENTS[0]
  const isRefunded = payment.status === 'refunded'
  const isFailed = payment.status === 'failed'

  return (
    <Page>
      <BackLink onClick={() => nav('/user/payment')}>← 결제 내역</BackLink>

      <ReceiptCard padded>
        <ReceiptHeader status={payment.status} paymentId={payment.id} />

        <SectionWrap>
          <SectionTitle>예약 정보</SectionTitle>
          <SpaceRow>
            <Image>{payment.space.emoji}</Image>
            <SpaceInfo>
              <Badge variant="sage" size="sm">{payment.space.type}</Badge>
              <SpaceName>{payment.space.name}</SpaceName>
              <Loc>📍 {payment.space.loc}</Loc>
              <BookingId>예약번호: {payment.bookingId}</BookingId>
            </SpaceInfo>
          </SpaceRow>

          <ScheduleRow>
            <ScheduleItem>
              <Label>일정</Label>
              <Value>{payment.space.dates}</Value>
            </ScheduleItem>
            <ScheduleItem>
              <Label>인원</Label>
              <Value>{payment.space.guests}</Value>
            </ScheduleItem>
          </ScheduleRow>
        </SectionWrap>

        <PaymentDetailCard payment={payment} />

        <PriceBreakdown items={payment.priceItems} total={payment.total} earnPoints={payment.earnPoints} />

        <Notice>
          <span>🔒</span>
          <span>본 영수증은 Sloway에서 발행한 결제 증빙 자료입니다. PG 암호화 연동으로 안전하게 처리되었습니다.</span>
        </Notice>
      </ReceiptCard>

      <Actions>
        {!isRefunded && !isFailed && (
          <Button variant="secondary" onClick={() => nav('/user/refund/request')}>
            환불 신청
          </Button>
        )}
        <Button variant="secondary" onClick={() => nav('/user/reservation')}>
          예약 상세 보기
        </Button>
        <Button variant="primary" onClick={() => window.print()}>
          🖨️ 영수증 출력
        </Button>
      </Actions>
    </Page>
  )
}

const Page = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-6) var(--space-5);
  animation: fadeInUp 480ms ease-out both;
`

const BackLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  color: var(--gray-600);
  margin-bottom: var(--space-5);

  &:hover {
    color: var(--gray-800);
  }
`

const ReceiptCard = styled(Card)`
  background: var(--white);
  margin-bottom: var(--space-5);
`

const SectionWrap = styled.div`
  padding: var(--space-5) 0;
  border-bottom: 1px dashed var(--gray-200);
`

const SectionTitle = styled.h4`
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: var(--space-3);
`

const SpaceRow = styled.div`
  display: flex;
  gap: var(--space-4);
  align-items: center;
  margin-bottom: var(--space-4);
`

const Image = styled.div`
  width: 64px;
  height: 64px;
  background: var(--gray-100);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  flex-shrink: 0;
`

const SpaceInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const SpaceName = styled.div`
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--gray-800);
  margin: 6px 0 4px;
`

const Loc = styled.div`
  font-size: 0.82rem;
  color: var(--gray-600);
  margin-bottom: 2px;
`

const BookingId = styled.div`
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--gray-400);
`

const ScheduleRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
  padding-top: var(--space-3);
  border-top: 1px solid var(--gray-200);

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`

const ScheduleItem = styled.div``

const Label = styled.div`
  font-size: 0.75rem;
  color: var(--gray-400);
  margin-bottom: 2px;
`

const Value = styled.div`
  font-size: 0.88rem;
  color: var(--gray-800);
  font-weight: 500;
`

const Notice = styled.div`
  margin-top: var(--space-4);
  padding: var(--space-3);
  background: var(--gray-100);
  border-radius: var(--radius-md);
  font-size: 0.78rem;
  color: var(--gray-600);
  display: flex;
  gap: 8px;
  align-items: flex-start;
  line-height: 1.5;
`

const Actions = styled.div`
  display: flex;
  gap: var(--space-3);
  justify-content: center;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`
