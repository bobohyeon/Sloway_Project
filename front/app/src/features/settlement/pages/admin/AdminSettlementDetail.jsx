import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'

import PageLayout from '../../../../app/layouts/page/PageLayout'

import { Card, Button, Badge, Section } from '../../../pay_shared/components'
import { Modal } from '../../../pay_shared/components/Modal'
import { SettlementBookingsList } from '../../components/host/SettlementBookingsList'

const SETTLEMENTS = [
  {
    id: 1,
    settlementId: 'STL-20260513-00892',
    status: 'scheduled',
    hostName: '청평 숲속 호스트',
    hostEmail: 'cheongpyeong@example.com',
    hostPhone: '010-****-1234',
    spaceName: '청평 숲속 파인뷰 스테이',
    spaceEmoji: '🌲',
    category: '워크앤스테이',
    location: '경기 가평',
    payoutAmount: 4856250,
    bankName: '국민은행',
    accountHolder: '김청평',
    maskedAccount: '1234-****-****',
    scheduledAt: '2026.05.13',
    completedAt: null,
    periodStart: '2026.05.09',
    periodEnd: '2026.05.12',
    feeRate: 12.5,
    feeAmount: 693750,
    totalSales: 5550000,
    bookingCount: 9,
    bookings: [
      { id: 1, bookingId: 'SW-...0921', customerName: '이재현 고객', guests: 2, nights: 2, checkInDate: '2026.05.05 ~ 05.07', amount: 540000 },
      { id: 2, bookingId: 'SW-...0918', customerName: '박지수 고객', guests: 4, nights: 3, checkInDate: '2026.05.10 ~ 05.13', amount: 810000 },
      { id: 3, bookingId: 'SW-...0917', customerName: '김도현 고객', guests: 2, nights: 2, checkInDate: '2026.05.14 ~ 05.16', amount: 540000 },
      { id: 4, bookingId: 'SW-...0912', customerName: '최민서 고객', guests: 3, nights: 4, checkInDate: '2026.05.18 ~ 05.22', amount: 1080000 },
      { id: 5, bookingId: 'SW-...0905', customerName: '정유나 고객', guests: 2, nights: 3, checkInDate: '2026.05.23 ~ 05.26', amount: 810000 },
      { id: 6, bookingId: 'SW-...0898', customerName: '한승원 고객', guests: 2, nights: 2, checkInDate: '2026.05.26 ~ 05.28', amount: 540000 },
      { id: 7, bookingId: 'SW-...0885', customerName: '강하늘 고객', guests: 4, nights: 2, checkInDate: '2026.05.28 ~ 05.30', amount: 720000 },
      { id: 8, bookingId: 'SW-...0876', customerName: '윤서준 고객', guests: 2, nights: 1, checkInDate: '2026.05.30 ~ 05.31', amount: 270000 },
      { id: 9, bookingId: 'SW-...0867', customerName: '서지호 고객', guests: 2, nights: 1, checkInDate: '2026.05.31 ~ 06.01', amount: 240000 },
    ],
  },
  {
    id: 3,
    settlementId: 'STL-20260513-00890',
    status: 'pending',
    hostName: '남해 올리브 호스트',
    hostEmail: 'namhae@example.com',
    hostPhone: '010-****-9012',
    spaceName: '남해 올리브 팜스테이',
    spaceEmoji: '🫒',
    category: '숙소',
    location: '경남 남해',
    payoutAmount: 3430000,
    bankName: '카카오뱅크',
    accountHolder: '이남해',
    maskedAccount: '9012-****-****',
    scheduledAt: '2026.05.13',
    completedAt: null,
    periodStart: '2026.05.09',
    periodEnd: '2026.05.12',
    feeRate: 12.5,
    feeAmount: 490000,
    totalSales: 3920000,
    bookingCount: 7,
    alertMessage: '계좌 인증 미완료 - 호스트 확인 필요',
    bookings: [
      { id: 1, bookingId: 'SW-...0501', customerName: '오성민 고객', guests: 2, nights: 3, checkInDate: '2026.05.03 ~ 05.06', amount: 540000 },
      { id: 2, bookingId: 'SW-...0487', customerName: '신지원 고객', guests: 3, nights: 2, checkInDate: '2026.05.10 ~ 05.12', amount: 480000 },
    ],
  },
  {
    id: 4,
    settlementId: 'STL-20260509-00847',
    status: 'completed',
    hostName: '청평 숲속 호스트',
    hostEmail: 'cheongpyeong@example.com',
    hostPhone: '010-****-1234',
    spaceName: '청평 숲속 파인뷰 스테이',
    spaceEmoji: '🌲',
    category: '워크앤스테이',
    location: '경기 가평',
    payoutAmount: 3657500,
    bankName: '국민은행',
    accountHolder: '김청평',
    maskedAccount: '1234-****-****',
    scheduledAt: '2026.05.09',
    completedAt: '2026.05.09 09:30',
    periodStart: '2026.05.05',
    periodEnd: '2026.05.08',
    feeRate: 12.5,
    feeAmount: 522500,
    totalSales: 4180000,
    bookingCount: 8,
    bookings: [
      { id: 1, bookingId: 'SW-...0847', customerName: '이재현 고객', guests: 2, nights: 2, checkInDate: '2026.04.05 ~ 04.07', amount: 540000 },
      { id: 2, bookingId: 'SW-...0723', customerName: '박지수 고객', guests: 4, nights: 3, checkInDate: '2026.04.10 ~ 04.13', amount: 720000 },
    ],
  },
]

export default function AdminSettlementDetail() {
  const nav = useNavigate()
  const { id } = useParams()
  const [payoutModalOpen, setPayoutModalOpen] = useState(false)
  const [holdModalOpen, setHoldModalOpen] = useState(false)

  const settlement = SETTLEMENTS.find((s) => String(s.id) === id) || SETTLEMENTS[0]
  const isScheduled = settlement.status === 'scheduled'
  const isPending = settlement.status === 'pending'
  const isCompleted = settlement.status === 'completed'

  const handlePayout = () => {
    alert(`PG사 송금 처리: ${settlement.payoutAmount.toLocaleString()}원`)
    setPayoutModalOpen(false)
  }

  return (
    <PageLayout
      title="정산 상세"
      description="호스트 정산 상세 내역과 지급을 처리합니다"
      backTo="/admin/settlement/host"
      backLabel="호스트 정산 관리"
      maxWidth={1200}
    >

      {isPending && (
        <AlertBanner>
          <AlertIcon>⚠️</AlertIcon>
          <AlertContent>
            <AlertTitle>지급 보류 - {settlement.alertMessage}</AlertTitle>
            <AlertDesc>계좌 정보를 확인하고 호스트에게 문의해주세요</AlertDesc>
          </AlertContent>
        </AlertBanner>
      )}

      {isCompleted && (
        <SuccessBanner>
          <AlertIcon>✓</AlertIcon>
          <AlertContent>
            <AlertTitle>지급 완료</AlertTitle>
            <AlertDesc>{settlement.completedAt}에 정상 지급되었습니다</AlertDesc>
          </AlertContent>
        </SuccessBanner>
      )}

      <DetailCard padded>
        <CardHeader>
          <HeaderLeft>
            {isScheduled && <Badge variant="info" size="md">⏰ 지급 예정</Badge>}
            {isPending && <Badge variant="warning" size="md">⚠️ 보류</Badge>}
            {isCompleted && <Badge variant="success" size="md">✓ 완료</Badge>}
            <SettlementId>{settlement.settlementId}</SettlementId>
          </HeaderLeft>
          <PayoutAmountBig>{settlement.payoutAmount.toLocaleString()}원</PayoutAmountBig>
        </CardHeader>

        <DetailGrid>
          <DetailGroup>
            <GroupTitle>호스트 정보</GroupTitle>
            <DetailRow>
              <Label>호스트명</Label>
              <Value>{settlement.hostName}</Value>
            </DetailRow>
            <DetailRow>
              <Label>이메일</Label>
              <Value>{settlement.hostEmail}</Value>
            </DetailRow>
            <DetailRow>
              <Label>연락처</Label>
              <Value>{settlement.hostPhone}</Value>
            </DetailRow>
          </DetailGroup>

          <DetailGroup>
            <GroupTitle>공간 정보</GroupTitle>
            <DetailRow>
              <Label>공간명</Label>
              <Value>
                {settlement.spaceEmoji} {settlement.spaceName}
              </Value>
            </DetailRow>
            <DetailRow>
              <Label>카테고리</Label>
              <Value>{settlement.category}</Value>
            </DetailRow>
            <DetailRow>
              <Label>위치</Label>
              <Value>{settlement.location}</Value>
            </DetailRow>
          </DetailGroup>

          <DetailGroup>
            <GroupTitle>정산 계좌</GroupTitle>
            <DetailRow>
              <Label>은행</Label>
              <Value>{settlement.bankName}</Value>
            </DetailRow>
            <DetailRow>
              <Label>예금주</Label>
              <Value>{settlement.accountHolder}</Value>
            </DetailRow>
            <DetailRow>
              <Label>계좌번호</Label>
              <Value>{settlement.maskedAccount}</Value>
            </DetailRow>
          </DetailGroup>

          <DetailGroup>
            <GroupTitle>정산 기간</GroupTitle>
            <DetailRow>
              <Label>대상 기간</Label>
              <Value>
                {settlement.periodStart} ~ {settlement.periodEnd}
              </Value>
            </DetailRow>
            <DetailRow>
              <Label>지급 예정일</Label>
              <Value>{settlement.scheduledAt}</Value>
            </DetailRow>
            {settlement.completedAt && (
              <DetailRow>
                <Label>지급 완료일</Label>
                <Value>{settlement.completedAt}</Value>
              </DetailRow>
            )}
          </DetailGroup>
        </DetailGrid>
      </DetailCard>

      <Section title="정산 내역">
        <BreakdownCard padded>
          <BreakdownRow>
            <BreakdownLabel>총 매출 ({settlement.bookingCount}건)</BreakdownLabel>
            <BreakdownValue>{settlement.totalSales.toLocaleString()}원</BreakdownValue>
          </BreakdownRow>
          <BreakdownRow>
            <BreakdownLabel>플랫폼 수수료 ({settlement.feeRate}%)</BreakdownLabel>
            <BreakdownValueRed>-{settlement.feeAmount.toLocaleString()}원</BreakdownValueRed>
          </BreakdownRow>
          <Divider />
          <BreakdownRow>
            <BreakdownLabel $bold>지급액</BreakdownLabel>
            <BreakdownValueSage>{settlement.payoutAmount.toLocaleString()}원</BreakdownValueSage>
          </BreakdownRow>
        </BreakdownCard>
      </Section>

      <Section title="포함된 예약 내역">
        <SettlementBookingsList
          bookings={settlement.bookings}
          totalSales={settlement.totalSales}
          feeRate={settlement.feeRate}
          feeAmount={settlement.feeAmount}
        />
      </Section>

      <Actions>
        {(isScheduled || isPending) && (
          <>
            <Button variant="secondary" onClick={() => setHoldModalOpen(true)}>
              {isPending ? '해제 후 처리' : '보류'}
            </Button>
            <Button variant="primary" onClick={() => setPayoutModalOpen(true)}>
              💰 지급 처리
            </Button>
          </>
        )}
        {isCompleted && (
          <Button variant="secondary" onClick={() => nav('/admin/settlement/host')}>
            목록으로
          </Button>
        )}
      </Actions>

      <Modal
        open={payoutModalOpen}
        onClose={() => setPayoutModalOpen(false)}
        title="지급 처리 확인"
        footer={
          <ModalFooter>
            <Button variant="secondary" onClick={() => setPayoutModalOpen(false)}>
              취소
            </Button>
            <Button variant="primary" onClick={handlePayout}>
              ✓ 지급 처리
            </Button>
          </ModalFooter>
        }
      >
        <ModalContent>
          <ModalRow>
            <ModalLabel>호스트</ModalLabel>
            <ModalValue>{settlement.hostName}</ModalValue>
          </ModalRow>
          <ModalRow>
            <ModalLabel>계좌</ModalLabel>
            <ModalValue>
              {settlement.bankName} {settlement.maskedAccount}
            </ModalValue>
          </ModalRow>
          <ModalRow>
            <ModalLabel>지급액</ModalLabel>
            <ModalValueBig>{settlement.payoutAmount.toLocaleString()}원</ModalValueBig>
          </ModalRow>
          <ModalNotice>
            ⚠️ 지급 처리 후에는 취소할 수 없어요. 계좌 정보를 확인했나요?
          </ModalNotice>
        </ModalContent>
      </Modal>

      <Modal
        open={holdModalOpen}
        onClose={() => setHoldModalOpen(false)}
        title={isPending ? '보류 해제' : '지급 보류'}
        footer={
          <ModalFooter>
            <Button variant="secondary" onClick={() => setHoldModalOpen(false)}>
              취소
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                alert(isPending ? '보류 해제됨' : '지급 보류됨')
                setHoldModalOpen(false)
              }}
            >
              확인
            </Button>
          </ModalFooter>
        }
      >
        <ModalContent>
          <ModalNotice>
            {isPending
              ? '호스트의 계좌 인증이 완료되었나요? 정상 정산 대기로 변경됩니다.'
              : '지급을 보류하시겠어요? 호스트에게 알림이 전송됩니다.'}
          </ModalNotice>
        </ModalContent>
      </Modal>
    </PageLayout>
  )
}
const AlertBanner = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4);
  background: rgba(220, 38, 38, 0.04);
  border: 1px solid rgba(220, 38, 38, 0.2);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-4);
`

const SuccessBanner = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4);
  background: rgba(168, 184, 159, 0.1);
  border: 1px solid rgba(168, 184, 159, 0.3);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-4);
`

const AlertIcon = styled.div`
  font-size: 1.3rem;
  flex-shrink: 0;
`

const AlertContent = styled.div`
  flex: 1;
`

const AlertTitle = styled.div`
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 2px;
`

const AlertDesc = styled.div`
  font-size: 0.85rem;
  color: var(--gray-600);
`

const DetailCard = styled(Card)`
  margin-bottom: var(--space-5);
`

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-5);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--gray-200);
`

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
`

const SettlementId = styled.div`
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--gray-600);
`

const PayoutAmountBig = styled.div`
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 500;
  color: var(--sage);
`

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-5);

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`

const DetailGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`

const GroupTitle = styled.div`
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--gray-600);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-2);
`

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2) 0;
`

const Label = styled.span`
  font-size: 0.85rem;
  color: var(--gray-600);
`

const Value = styled.span`
  font-size: 0.9rem;
  color: var(--gray-800);
  font-weight: 500;
`

const BreakdownCard = styled(Card)``

const BreakdownRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2) 0;
`

const BreakdownLabel = styled.span`
  font-size: ${(p) => (p.$bold ? '1rem' : '0.9rem')};
  color: var(--gray-700);
  font-weight: ${(p) => (p.$bold ? 600 : 400)};
`

const BreakdownValue = styled.span`
  font-size: 0.95rem;
  color: var(--gray-800);
`

const BreakdownValueRed = styled.span`
  font-size: 0.95rem;
  color: #c44b3c;
  font-weight: 500;
`

const BreakdownValueSage = styled.span`
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--sage);
`

const Divider = styled.div`
  height: 1px;
  background: var(--gray-200);
  margin: var(--space-3) 0;
`

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: var(--space-6);
`

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`

const ModalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2) 0;
  border-bottom: 1px solid var(--gray-100);
`

const ModalLabel = styled.span`
  color: var(--gray-600);
  font-size: 0.9rem;
`

const ModalValue = styled.span`
  color: var(--gray-800);
  font-weight: 500;
`

const ModalValueBig = styled.span`
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--sage);
`

const ModalNotice = styled.div`
  margin-top: var(--space-3);
  padding: var(--space-3);
  background: var(--cream);
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  color: var(--gray-700);
  line-height: 1.5;
`

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
`
