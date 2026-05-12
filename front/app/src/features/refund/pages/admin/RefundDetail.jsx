import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'

import { Card, Section, Button, Badge } from '../../../pay_shared/components'
import { RefundStatusBanner } from '../../components/admin/RefundStatusBanner'
import { RefundProcessHistory } from '../../components/admin/RefundProcessHistory'
import { AdminMemoBox } from '../../components/admin/AdminMemoBox'
import { useRefundCalculation } from '../../hooks/useRefundCalculation'

const REFUNDS = [
  {
    id: 1,
    refundId: 'RFD-20260508-00921',
    bookingId: 'SW-20260512-001045',
    paymentId: 'PAY-20260501-00892',
    status: 'failed',
    userName: '박지수',
    userEmail: 'jisoo.park@example.com',
    userPhone: '010-****-2390',
    spaceName: '강릉 바다향 코워킹',
    spaceEmoji: '🌊',
    spaceCategory: '코워킹오피스',
    spaceHost: '강릉 워크 호스트',
    checkInDate: '2026-05-15',
    paidAmount: 290000,
    method: '카카오페이',
    methodIcon: '💬',
    pg: 'KG이니시스',
    approvalNo: 'KP-20260501-00892',
    requestedAt: '2026.05.08 09:14',
    reason: '일정이 변경됐어요',
    isHostRejected: false,
    alertMessage: 'PG사 송금 실패 - 자동 재시도 3회 실패. 수동 처리 필요',
  },
  {
    id: 2,
    refundId: 'RFD-20260507-00918',
    bookingId: 'SW-20260516-001052',
    paymentId: 'PAY-20260420-00845',
    status: 'completed',
    userName: '김도현',
    userEmail: 'dohyun.kim@example.com',
    userPhone: '010-****-5678',
    spaceName: '청평 숲속 파인뷰 스테이',
    spaceEmoji: '🌲',
    spaceCategory: '워크앤스테이',
    spaceHost: '청평 숲속 호스트',
    checkInDate: '2026-05-16',
    paidAmount: 540000,
    method: '네이버페이',
    methodIcon: 'N',
    pg: '네이버페이',
    approvalNo: 'NP-20260420-00845',
    requestedAt: '2026.05.07 18:22',
    reason: '호스트가 예약을 거절했어요',
    isHostRejected: true,
    alertMessage: null,
  },
  {
    id: 3,
    refundId: 'RFD-20260507-00917',
    bookingId: 'SW-20260514-001038',
    paymentId: 'PAY-20260418-00823',
    status: 'completed',
    userName: '최민서',
    userEmail: 'minseo.choi@example.com',
    userPhone: '010-****-9012',
    spaceName: '청평 숲속 파인뷰 스테이',
    spaceEmoji: '🌲',
    spaceCategory: '워크앤스테이',
    spaceHost: '청평 숲속 호스트',
    checkInDate: '2026-05-14',
    paidAmount: 510000,
    method: '카카오페이',
    methodIcon: '💬',
    pg: 'KG이니시스',
    approvalNo: 'KP-20260418-00823',
    requestedAt: '2026.05.07 14:05',
    reason: '여행 계획이 바뀌었어요',
    isHostRejected: false,
    alertMessage: null,
  },
  {
    id: 4,
    refundId: 'RFD-20260506-00912',
    bookingId: 'SW-20260512-001025',
    paymentId: 'PAY-20260415-00798',
    status: 'completed',
    userName: '정유나',
    userEmail: 'yuna.jung@example.com',
    userPhone: '010-****-3456',
    spaceName: '강릉 바다향 코워킹',
    spaceEmoji: '🌊',
    spaceCategory: '코워킹오피스',
    spaceHost: '강릉 워크 호스트',
    checkInDate: '2026-05-12',
    paidAmount: 880000,
    method: '토스페이',
    methodIcon: 'T',
    pg: '토스페이먼츠',
    approvalNo: 'TP-20260415-00798',
    requestedAt: '2026.05.06 21:38',
    reason: '개인 사정으로 취소해요',
    isHostRejected: false,
    alertMessage: null,
  },
  {
    id: 5,
    refundId: 'RFD-20260424-00847',
    bookingId: 'SW-20260508-000847',
    paymentId: 'PAY-20260424-00847',
    status: 'completed',
    userName: '김우영',
    userEmail: 'wooyoung.kim@example.com',
    userPhone: '010-****-1234',
    spaceName: '청평 숲속 파인뷰 스테이',
    spaceEmoji: '🌲',
    spaceCategory: '워크앤스테이',
    spaceHost: '청평 숲속 호스트',
    checkInDate: '2026-05-08',
    paidAmount: 326500,
    method: '카카오페이',
    methodIcon: '💬',
    pg: 'KG이니시스',
    approvalNo: 'KP-20260424-00512847',
    requestedAt: '2026.04.24 14:32',
    reason: '일정이 변경됐어요',
    isHostRejected: false,
    alertMessage: null,
  },
]

// status별 처리 이력 생성
function buildProcessHistory(refund) {
  const baseEvents = [
    {
      status: 'done',
      title: '환불 신청 접수',
      description: '사용자가 환불 신청을 완료했습니다',
      at: refund.requestedAt,
      actor: `사용자: ${refund.userName}`,
    },
    {
      status: 'done',
      title: '자동 환불 정책 검증',
      description: '환불 정책에 따라 환불율을 계산했습니다',
      at: refund.requestedAt,
      actor: '시스템',
    },
  ]

  if (refund.status === 'failed') {
    return [
      ...baseEvents,
      {
        status: 'error',
        title: 'PG사 송금 시도 실패',
        description: '카카오페이 응답: ERR_INSUFFICIENT_BALANCE (잔액 부족)',
        at: '2026.05.08 09:15',
        actor: '시스템',
      },
      {
        status: 'error',
        title: '자동 재시도 (3회) 모두 실패',
        description: 'PG사 응답 대기 - 자동 재처리 예정',
        at: '2026.05.08 09:18',
        actor: '시스템',
      },
    ]
  }

  // completed
  return [
    ...baseEvents,
    {
      status: 'done',
      title: 'PG사 송금 요청',
      description: `${refund.method}로 환불 요청 전송`,
      at: refund.requestedAt,
      actor: '시스템',
    },
    {
      status: 'done',
      title: '환불 완료',
      description: '사용자 계좌로 환불 완료',
      at: '2026.05.08 10:23',
      actor: '시스템',
    },
  ]
}

// status별 저장된 메모
function getSavedMemos(refund) {
  if (refund.status === 'failed') {
    return [
      {
        author: '시스템',
        at: '2026.05.08 09:18',
        content: '자동 처리 실패 - 자동 재시도 큐로 이관됨',
      },
    ]
  }
  return []
}

export default function RefundDetail() {
  const nav = useNavigate()
  const { id } = useParams()
  const [memo, setMemo] = useState('')

  // ID로 환불 찾기 (없으면 첫 번째)
  const refund = REFUNDS.find((r) => String(r.id) === id) || REFUNDS[0]
  const processHistory = buildProcessHistory(refund)
  const savedMemos = getSavedMemos(refund)
  const isFailed = refund.status === 'failed'

  const calc = useRefundCalculation({
    amount: refund.paidAmount,
    checkInDate: refund.checkInDate,
    hostRejected: refund.isHostRejected,
  })

  return (
    <PageWrapper>
      <Container>
      <BackLink onClick={() => nav('/admin/refund')}>← 환불 목록</BackLink>

      <Header>
        <Title>환불 상세</Title>
        <Description>환불 처리 내역을 확인하세요</Description>
      </Header>

      {isFailed && (
        <RefundStatusBanner
          variant="danger"
          title={`⚠️ PG 송금 실패 - ${refund.alertMessage}`}
          description="자동 재시도 진행 중입니다. PG사 응답에 따라 환불이 완료되거나 재처리됩니다."
        />
      )}
      {refund.status === 'completed' && (
        <RefundStatusBanner
          variant="success"
          title="✓ 환불 완료"
          description={`${calc.refundAmount.toLocaleString()}원이 사용자에게 환불 처리되었습니다.`}
        />
      )}

      <DetailGrid>
        <Section title="환불 정보">
          <InfoCard padded>
            <InfoHeader>
              {refund.status === 'failed' && <Badge variant="danger" size="md">⚠️ 송금 실패</Badge>}
              {refund.status === 'completed' && <Badge variant="success" size="md">✓ 완료</Badge>}
              <RefundId>{refund.refundId}</RefundId>
            </InfoHeader>

            <InfoBlock>
              <Row>
                <Label>신청일시</Label>
                <Value>{refund.requestedAt}</Value>
              </Row>
              <Row>
                <Label>환불 사유</Label>
                <Value>"{refund.reason}"</Value>
              </Row>
              <Row>
                <Label>예약 번호</Label>
                <Mono>{refund.bookingId}</Mono>
              </Row>
              <Row>
                <Label>결제 번호</Label>
                <Mono>{refund.paymentId}</Mono>
              </Row>
            </InfoBlock>

            <Divider />

            <InfoBlock>
              <SubTitle>환불 정책 적용</SubTitle>
              <Row>
                <Label>체크인까지 D-day</Label>
                <Value>{calc.daysUntilCheckIn}일</Value>
              </Row>
              <Row>
                <Label>환불율</Label>
                <Badge variant="success" size="sm">
                  {calc.rate}% 환불
                </Badge>
              </Row>
              <Row>
                <Label>결제 금액</Label>
                <Value>{refund.paidAmount.toLocaleString()}원</Value>
              </Row>
              <Row>
                <Label>환불 금액</Label>
                <Highlight>{calc.refundAmount.toLocaleString()}원</Highlight>
              </Row>
            </InfoBlock>
          </InfoCard>
        </Section>

        <SideColumn>
          <Section title="사용자 정보">
            <InfoCard padded>
              <UserHeader>
                <UserAvatar>👤</UserAvatar>
                <UserMain>
                  <UserName>{refund.userName}</UserName>
                  <UserEmail>{refund.userEmail}</UserEmail>
                </UserMain>
              </UserHeader>
              <UserMeta>
                <Row>
                  <Label>연락처</Label>
                  <Value>{refund.userPhone}</Value>
                </Row>
              </UserMeta>
            </InfoCard>
          </Section>

          <Section title="예약 공간">
            <InfoCard padded>
              <SpaceHeader>
                <SpaceEmoji>{refund.spaceEmoji}</SpaceEmoji>
                <SpaceMain>
                  <SpaceName>{refund.spaceName}</SpaceName>
                  <Badge variant="sage" size="sm">{refund.spaceCategory}</Badge>
                </SpaceMain>
              </SpaceHeader>
              <SpaceMeta>
                <Row>
                  <Label>호스트</Label>
                  <Value>{refund.spaceHost}</Value>
                </Row>
                <Row>
                  <Label>체크인</Label>
                  <Value>{refund.checkInDate}</Value>
                </Row>
              </SpaceMeta>
            </InfoCard>
          </Section>

          <Section title="결제 정보">
            <InfoCard padded>
              <Row>
                <Label>결제 수단</Label>
                <Value>
                  <MethodChip>{refund.methodIcon}</MethodChip>
                  {refund.method}
                </Value>
              </Row>
              <Row>
                <Label>PG사</Label>
                <Value>{refund.pg}</Value>
              </Row>
              <Row>
                <Label>승인번호</Label>
                <Mono>{refund.approvalNo}</Mono>
              </Row>
            </InfoCard>
          </Section>
        </SideColumn>
      </DetailGrid>

      <RefundProcessHistory events={processHistory} />

      <AdminMemoBox memo={memo} onChange={setMemo} savedMemos={savedMemos} />

      <Actions>
        <ActionRight style={{ marginLeft: 'auto' }}>
          <Button variant="secondary" onClick={() => nav('/admin/refund')}>
            목록으로
          </Button>
        </ActionRight>
      </Actions>
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

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: var(--space-4);
  margin-bottom: var(--space-5);

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`

const SideColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`

const InfoCard = styled(Card)``

const InfoHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-3);
  padding-bottom: var(--space-3);
  border-bottom: 1px dashed var(--gray-200);
`

const RefundId = styled.span`
  font-family: var(--font-mono);
  font-size: 0.82rem;
  color: var(--gray-600);
`

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const SubTitle = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 4px;
`

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
`

const Label = styled.span`
  color: var(--gray-400);
`

const Value = styled.span`
  color: var(--gray-800);
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
`

const Mono = styled.span`
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--gray-800);
  font-weight: 500;
`

const Highlight = styled.span`
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--sage);
  letter-spacing: -0.02em;
`

const Divider = styled.hr`
  border: none;
  border-top: 1px dashed var(--gray-200);
  margin: var(--space-3) 0;
`

const UserHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
  padding-bottom: var(--space-3);
  border-bottom: 1px dashed var(--gray-200);
`

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  background: var(--cream);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
`

const UserMain = styled.div`
  flex: 1;
`

const UserName = styled.div`
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 2px;
`

const UserEmail = styled.div`
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--gray-400);
`

const UserMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const SpaceHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
  padding-bottom: var(--space-3);
  border-bottom: 1px dashed var(--gray-200);
`

const SpaceEmoji = styled.div`
  width: 40px;
  height: 40px;
  background: var(--gray-100);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
`

const SpaceMain = styled.div`
  flex: 1;
`

const SpaceName = styled.div`
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 4px;
`

const SpaceMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const MethodChip = styled.span`
  width: 20px;
  height: 20px;
  background: var(--gray-100);
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
`

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: var(--space-3);
  padding-top: var(--space-5);
  border-top: 1px solid var(--gray-200);
  margin-top: var(--space-5);

  @media (max-width: 640px) {
    flex-direction: column-reverse;
  }
`

const ActionLeft = styled.div``

const ActionRight = styled.div`
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;

  @media (max-width: 640px) {
    flex-direction: column;

    & > button {
      width: 100%;
    }
  }
`
