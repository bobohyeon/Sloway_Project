import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'

import { Card, Section, Button } from '../../../pay_shared/components'
import { SettlementDetailHeader } from '../../components/host/SettlementDetailHeader'
import { SettlementBookingsList } from '../../components/host/SettlementBookingsList'

const SETTLEMENT = {
  settlementId: 'STL-202604-00847',
  status: 'completed',
  spaceName: '청평 숲속 파인뷰 스테이',
  spaceEmoji: '🌲',
  category: '워크앤스테이',
  location: '경기 가평',
  payoutAmount: 3657500,
  bankName: '국민은행',
  maskedAccount: '1234-****-****',
  scheduledAt: '2026.05.05',
  completedAt: '2026.05.05 09:30',
  periodStart: '2026.04.01',
  periodEnd: '2026.04.30',
  feeRate: 12.5,
  feeAmount: 522500,
  totalSales: 4180000,
}

const BOOKINGS = [
  {
    id: 1,
    bookingId: 'SW-...0847',
    customerName: '이재현 고객',
    guests: 2,
    nights: 2,
    checkInDate: '2026.04.05 ~ 04.07',
    amount: 540000,
  },
  {
    id: 2,
    bookingId: 'SW-...0723',
    customerName: '박지수 고객',
    guests: 4,
    nights: 3,
    checkInDate: '2026.04.10 ~ 04.13',
    amount: 720000,
  },
  {
    id: 3,
    bookingId: 'SW-...0689',
    customerName: '김도현 고객',
    guests: 2,
    nights: 1,
    checkInDate: '2026.04.15 ~ 04.16',
    amount: 290000,
  },
  {
    id: 4,
    bookingId: 'SW-...0612',
    customerName: '최민서 고객',
    guests: 3,
    nights: 2,
    checkInDate: '2026.04.18 ~ 04.20',
    amount: 510000,
  },
  {
    id: 5,
    bookingId: 'SW-...0588',
    customerName: '정유나 고객',
    guests: 2,
    nights: 4,
    checkInDate: '2026.04.20 ~ 04.24',
    amount: 880000,
  },
  {
    id: 6,
    bookingId: 'SW-...0523',
    customerName: '한승원 고객',
    guests: 2,
    nights: 1,
    checkInDate: '2026.04.25 ~ 04.26',
    amount: 290000,
  },
  {
    id: 7,
    bookingId: 'SW-...0489',
    customerName: '윤서준 고객',
    guests: 4,
    nights: 2,
    checkInDate: '2026.04.27 ~ 04.29',
    amount: 510000,
  },
  {
    id: 8,
    bookingId: 'SW-...0456',
    customerName: '강하늘 고객',
    guests: 2,
    nights: 1,
    checkInDate: '2026.04.30 ~ 05.01',
    amount: 440000,
  },
]

export default function SettlementDetail() {
  const nav = useNavigate()
  const { id } = useParams()

  return (
    <Page>
      <BackLink onClick={() => nav('/host/settlement/history')}>← 정산 내역으로</BackLink>

      <Header>
        <Title>정산 상세</Title>
        <Description>이 정산에 포함된 예약과 수수료 내역을 확인하세요</Description>
      </Header>

      <SectionWrap>
        <SettlementDetailHeader settlement={SETTLEMENT} />
      </SectionWrap>

      <Section title="정산 기간">
        <PeriodCard padded>
          <PeriodIcon>📅</PeriodIcon>
          <PeriodText>
            <PeriodMain>
              {SETTLEMENT.periodStart} ~ {SETTLEMENT.periodEnd}
            </PeriodMain>
            <PeriodSub>매월 1일~말일 매출이 익월 5일에 정산돼요</PeriodSub>
          </PeriodText>
        </PeriodCard>
      </Section>

      <SettlementBookingsList
        bookings={BOOKINGS}
        totalSales={SETTLEMENT.totalSales}
        feeRate={SETTLEMENT.feeRate}
        feeAmount={SETTLEMENT.feeAmount}
      />

      <Actions>
        <Button variant="secondary" onClick={() => nav('/host/settlement/history')}>
          목록으로
        </Button>
        {SETTLEMENT.status === 'completed' && (
          <Button variant="primary" onClick={() => alert(`정산서 다운로드: ${SETTLEMENT.settlementId}`)}>
            📄 정산서 다운로드
          </Button>
        )}
      </Actions>
    </Page>
  )
}

const Page = styled.div`
  width: 100%;
  max-width: 800px;
  padding: var(--space-6) var(--space-5);
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

const SectionWrap = styled.div`
  margin-bottom: var(--space-5);
`

const PeriodCard = styled(Card)`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
`

const PeriodIcon = styled.div`
  font-size: 1.8rem;
  flex-shrink: 0;
`

const PeriodText = styled.div`
  flex: 1;
`

const PeriodMain = styled.div`
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 2px;
`

const PeriodSub = styled.div`
  font-size: 0.78rem;
  color: var(--gray-600);
`

const Actions = styled.div`
  display: flex;
  gap: var(--space-3);
  justify-content: center;
  margin-top: var(--space-6);

  @media (max-width: 480px) {
    flex-direction: column;
  }
`
