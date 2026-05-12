import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'

import PageLayout from '../../../../app/layouts/page/PageLayout'

import { Card, Section, Button } from '../../../pay_shared/components'
import { SettlementDetailHeader } from '../../components/host/SettlementDetailHeader'
import { SettlementBookingsList } from '../../components/host/SettlementBookingsList'

const SETTLEMENTS = [
  {
    id: 1,
    settlementId: 'STL-20260513-00892',
    status: 'scheduled',
    spaceName: '청평 숲속 파인뷰 스테이',
    spaceEmoji: '🌲',
    category: '워크앤스테이',
    location: '경기 가평',
    payoutAmount: 2432500,
    bankName: '국민은행',
    maskedAccount: '1234-****-****',
    scheduledAt: '2026.05.13',
    completedAt: null,
    periodStart: '2026.05.09',
    periodEnd: '2026.05.12',
    feeRate: 12.5,
    feeAmount: 347500,
    totalSales: 2780000,
    bookings: [
      { id: 1, bookingId: 'SW-...0921', customerName: '이재현 고객', guests: 2, nights: 2, checkInDate: '2026.05.20 ~ 05.22', amount: 540000 },
      { id: 2, bookingId: 'SW-...0918', customerName: '박지수 고객', guests: 4, nights: 3, checkInDate: '2026.05.25 ~ 05.28', amount: 810000 },
      { id: 3, bookingId: 'SW-...0917', customerName: '김도현 고객', guests: 2, nights: 2, checkInDate: '2026.05.30 ~ 06.01', amount: 540000 },
      { id: 4, bookingId: 'SW-...0912', customerName: '최민서 고객', guests: 3, nights: 2, checkInDate: '2026.06.04 ~ 06.06', amount: 540000 },
      { id: 5, bookingId: 'SW-...0905', customerName: '정유나 고객', guests: 2, nights: 1, checkInDate: '2026.06.10 ~ 06.11', amount: 350000 },
    ],
  },
  {
    id: 2,
    settlementId: 'STL-20260509-00847',
    status: 'completed',
    spaceName: '청평 숲속 파인뷰 스테이',
    spaceEmoji: '🌲',
    category: '워크앤스테이',
    location: '경기 가평',
    payoutAmount: 1820000,
    bankName: '국민은행',
    maskedAccount: '1234-****-****',
    scheduledAt: '2026.05.09',
    completedAt: '2026.05.09 09:30',
    periodStart: '2026.05.05',
    periodEnd: '2026.05.08',
    feeRate: 12.5,
    feeAmount: 260000,
    totalSales: 2080000,
    bookings: [
      { id: 1, bookingId: 'SW-...0847', customerName: '이재현 고객', guests: 2, nights: 2, checkInDate: '2026.05.15 ~ 05.17', amount: 540000 },
      { id: 2, bookingId: 'SW-...0723', customerName: '박지수 고객', guests: 4, nights: 3, checkInDate: '2026.05.20 ~ 05.23', amount: 720000 },
      { id: 3, bookingId: 'SW-...0689', customerName: '김도현 고객', guests: 2, nights: 1, checkInDate: '2026.05.25 ~ 05.26', amount: 290000 },
      { id: 4, bookingId: 'SW-...0612', customerName: '최민서 고객', guests: 2, nights: 2, checkInDate: '2026.05.28 ~ 05.30', amount: 530000 },
    ],
  },
  {
    id: 3,
    settlementId: 'STL-20260505-00689',
    status: 'completed',
    spaceName: '청평 숲속 파인뷰 스테이',
    spaceEmoji: '🌲',
    category: '워크앤스테이',
    location: '경기 가평',
    payoutAmount: 1360000,
    bankName: '국민은행',
    maskedAccount: '1234-****-****',
    scheduledAt: '2026.05.05',
    completedAt: '2026.05.05 09:30',
    periodStart: '2026.05.01',
    periodEnd: '2026.05.04',
    feeRate: 12.5,
    feeAmount: 194000,
    totalSales: 1554000,
    bookings: [
      { id: 1, bookingId: 'SW-...0412', customerName: '이수진 고객', guests: 2, nights: 2, checkInDate: '2026.05.10 ~ 05.12', amount: 540000 },
      { id: 2, bookingId: 'SW-...0398', customerName: '조민호 고객', guests: 4, nights: 3, checkInDate: '2026.05.14 ~ 05.17', amount: 720000 },
      { id: 3, bookingId: 'SW-...0376', customerName: '신예은 고객', guests: 2, nights: 1, checkInDate: '2026.05.20 ~ 05.21', amount: 294000 },
    ],
  },
  {
    id: 4,
    settlementId: 'STL-20260501-00523',
    status: 'completed',
    spaceName: '강릉 바다향 코워킹',
    spaceEmoji: '🌊',
    category: '코워킹오피스',
    location: '강원 강릉',
    payoutAmount: 882000,
    bankName: '국민은행',
    maskedAccount: '1234-****-****',
    scheduledAt: '2026.05.01',
    completedAt: '2026.05.01 09:30',
    periodStart: '2026.04.27',
    periodEnd: '2026.04.30',
    feeRate: 10,
    feeAmount: 98000,
    totalSales: 980000,
    bookings: [
      { id: 1, bookingId: 'SW-...0289', customerName: '이재훈 고객', guests: 1, nights: 0, checkInDate: '2026.05.05 (4시간)', amount: 28000 },
      { id: 2, bookingId: 'SW-...0276', customerName: '강민서 고객', guests: 2, nights: 0, checkInDate: '2026.05.08 (8시간)', amount: 280000 },
      { id: 3, bookingId: 'SW-...0265', customerName: '서지원 고객', guests: 1, nights: 0, checkInDate: '2026.05.10 (4시간)', amount: 28000 },
      { id: 4, bookingId: 'SW-...0254', customerName: '윤채영 고객', guests: 3, nights: 0, checkInDate: '2026.05.12 (8시간)', amount: 420000 },
      { id: 5, bookingId: 'SW-...0243', customerName: '오현우 고객', guests: 2, nights: 0, checkInDate: '2026.05.15 (8시간)', amount: 224000 },
    ],
  },
  {
    id: 5,
    settlementId: 'STL-20260427-00456',
    status: 'completed',
    spaceName: '청평 숲속 파인뷰 스테이',
    spaceEmoji: '🌲',
    category: '워크앤스테이',
    location: '경기 가평',
    payoutAmount: 2940000,
    bankName: '국민은행',
    maskedAccount: '1234-****-****',
    scheduledAt: '2026.04.27',
    completedAt: '2026.04.27 09:30',
    periodStart: '2026.04.23',
    periodEnd: '2026.04.26',
    feeRate: 12.5,
    feeAmount: 420000,
    totalSales: 3360000,
    bookings: [
      { id: 1, bookingId: 'SW-...0234', customerName: '김도윤 고객', guests: 2, nights: 2, checkInDate: '2026.05.05 ~ 05.07', amount: 540000 },
      { id: 2, bookingId: 'SW-...0218', customerName: '박지민 고객', guests: 4, nights: 3, checkInDate: '2026.05.10 ~ 05.13', amount: 810000 },
      { id: 3, bookingId: 'SW-...0203', customerName: '이서영 고객', guests: 2, nights: 2, checkInDate: '2026.05.15 ~ 05.17', amount: 540000 },
      { id: 4, bookingId: 'SW-...0189', customerName: '정하늘 고객', guests: 3, nights: 4, checkInDate: '2026.05.20 ~ 05.24', amount: 1080000 },
      { id: 5, bookingId: 'SW-...0174', customerName: '한지윤 고객', guests: 2, nights: 1, checkInDate: '2026.05.26 ~ 05.27', amount: 390000 },
    ],
  },
]

export default function SettlementDetail() {
  const nav = useNavigate()
  const { id } = useParams()

  // ID로 정산 찾기 (없으면 첫 번째)
  const settlement = SETTLEMENTS.find((s) => String(s.id) === id) || SETTLEMENTS[0]

  return (
    <PageLayout
      title="정산 상세"
      description="이 정산에 포함된 예약과 수수료 내역을 확인하세요"
      backTo="/host/settlement/history"
      backLabel="정산 내역"
      maxWidth={800}
    >

      <SectionWrap>
        <SettlementDetailHeader settlement={settlement} />
      </SectionWrap>

      <Section title="정산 기간">
        <PeriodCard padded>
          <PeriodIcon>📅</PeriodIcon>
          <PeriodText>
            <PeriodMain>
              {settlement.periodStart} ~ {settlement.periodEnd}
            </PeriodMain>
            <PeriodSub>4일간 발생한 결제 건들이 자동 정산돼요</PeriodSub>
          </PeriodText>
        </PeriodCard>
      </Section>

      <SettlementBookingsList
        bookings={settlement.bookings}
        totalSales={settlement.totalSales}
        feeRate={settlement.feeRate}
        feeAmount={settlement.feeAmount}
      />

      <Actions>
        <Button variant="secondary" onClick={() => nav('/host/settlement/history')}>
          목록으로
        </Button>
        {settlement.status === 'completed' && (
          <Button variant="primary" onClick={() => alert(`정산서 다운로드: ${settlement.settlementId}`)}>
            📄 정산서 다운로드
          </Button>
        )}
      </Actions>
    </PageLayout>
  )
}
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
