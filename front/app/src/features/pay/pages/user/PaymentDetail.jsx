import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { Card, Button, Badge } from '../../../pay_shared/components'
import { ReceiptHeader } from '../../components/user/ReceiptHeader'
import { PaymentDetailCard } from '../../components/user/PaymentDetailCard'
import { PriceBreakdown } from '../../components/user/PriceBreakdown'

const PAYMENT = {
  id: 'PAY-20260424-00847',
  bookingId: 'SW-20260508-000847',
  status: 'completed',
  paidAt: '2026.04.24 14:32',
  method: '카카오페이',
  methodIcon: '💬',
  pg: 'KG이니시스',
  approvalNo: 'KP-20260424-00512847',
  cardInfo: '신한 ****-1234',
  installments: '일시불',
}

const SPACE = {
  name: '청평 숲속 파인뷰 스테이',
  type: '워크앤스테이',
  loc: '경기 가평',
  emoji: '🌲',
  dates: '5월 8일 (목) ~ 5월 10일 (토) · 2박',
  guests: '성인 2명',
}

const PRICE_ITEMS = [
  { label: '185,000원 × 2박', amount: 370000 },
  { label: '서비스 수수료', amount: 12000 },
  { label: '🎟️ 봄맞이 워케이션 15% 할인', amount: 55500, type: 'discount' },
  { label: '🌱 포인트 사용', amount: 2450, type: 'discount' },
]

const TOTAL = 324050
const EARN_POINTS = 3240

export default function PaymentDetail() {
  const nav = useNavigate()

  return (
    <Page>
      <BackLink onClick={() => nav('/user/payment')}>← 결제 내역</BackLink>

      <ReceiptCard padded>
        <ReceiptHeader status={PAYMENT.status} paymentId={PAYMENT.id} />

        <SectionWrap>
          <SectionTitle>예약 정보</SectionTitle>
          <SpaceRow>
            <Image>{SPACE.emoji}</Image>
            <SpaceInfo>
              <Badge variant="sage" size="sm">{SPACE.type}</Badge>
              <SpaceName>{SPACE.name}</SpaceName>
              <Loc>📍 {SPACE.loc}</Loc>
              <BookingId>예약번호: {PAYMENT.bookingId}</BookingId>
            </SpaceInfo>
          </SpaceRow>

          <ScheduleRow>
            <ScheduleItem>
              <Label>일정</Label>
              <Value>{SPACE.dates}</Value>
            </ScheduleItem>
            <ScheduleItem>
              <Label>인원</Label>
              <Value>{SPACE.guests}</Value>
            </ScheduleItem>
          </ScheduleRow>
        </SectionWrap>

        <PaymentDetailCard payment={PAYMENT} />

        <PriceBreakdown items={PRICE_ITEMS} total={TOTAL} earnPoints={EARN_POINTS} />

        <Notice>
          <span>🔒</span>
          <span>본 영수증은 Sloway에서 발행한 결제 증빙 자료입니다. PG 암호화 연동으로 안전하게 처리되었습니다.</span>
        </Notice>
      </ReceiptCard>

      <Actions>
        <Button variant="secondary" onClick={() => alert('환불 신청 페이지 (U18)로 이동')}>
          환불 신청
        </Button>
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
