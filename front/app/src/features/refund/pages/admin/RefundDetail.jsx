import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'

import { Card, Section, Button, Badge } from '../../../pay_shared/components'
import { RefundStatusBanner } from '../../components/admin/RefundStatusBanner'
import { RefundProcessHistory } from '../../components/admin/RefundProcessHistory'
import { AdminMemoBox } from '../../components/admin/AdminMemoBox'
import { useRefundCalculation } from '../../hooks/useRefundCalculation'

const REFUND = {
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
}

const PROCESS_HISTORY = [
  {
    status: 'done',
    title: '환불 신청 접수',
    description: '사용자가 환불 신청을 완료했습니다',
    at: '2026.05.08 09:14',
    actor: '사용자: 박지수',
  },
  {
    status: 'done',
    title: '자동 환불 정책 검증',
    description: 'D-7일 적용 → 100% 환불 가능 확인',
    at: '2026.05.08 09:14',
    actor: '시스템',
  },
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
    description: '최종 실패 - 관리자 수동 처리 필요',
    at: '2026.05.08 09:18',
    actor: '시스템',
  },
  {
    status: 'active',
    title: '관리자 검토 대기 중',
    at: null,
    actor: null,
  },
]

const SAVED_MEMOS = [
  {
    author: '시스템',
    at: '2026.05.08 09:18',
    content: '자동 처리 실패 - 우선순위 HIGH 큐로 이관됨',
  },
]

export default function RefundDetail() {
  const nav = useNavigate()
  const { id } = useParams()
  const [memo, setMemo] = useState('')

  const calc = useRefundCalculation({
    amount: REFUND.paidAmount,
    checkInDate: REFUND.checkInDate,
    hostRejected: REFUND.isHostRejected,
  })

  const handleManualApprove = () => {
    if (window.confirm(`${calc.refundAmount.toLocaleString()}원 환불을 수동 승인하시겠어요?`)) {
      alert('수동 승인 완료. 다시 PG사로 송금 요청합니다.')
      nav('/admin/refund')
    }
  }

  const handleReject = () => {
    if (window.confirm('환불 요청을 거절하시겠어요? 사용자에게 알림이 발송됩니다.')) {
      alert('환불 거절 처리됐어요. 사용자에게 알림 발송됨.')
      nav('/admin/refund')
    }
  }

  const handleRetry = () => {
    if (window.confirm('PG사 송금을 재시도하시겠어요?')) {
      alert('PG사로 재요청을 보냈어요. 결과는 처리 이력에서 확인하세요.')
    }
  }

  return (
    <Page>
      <BackLink onClick={() => nav('/admin/refund')}>← 환불 목록</BackLink>

      <Header>
        <Title>환불 상세 처리</Title>
        <Description>환불 신청을 검토하고 처리하세요</Description>
      </Header>

      <RefundStatusBanner
        variant="danger"
        title={`⚠️ 이상 감지 - ${REFUND.alertMessage}`}
        description="PG사 측 송금이 실패했어요. 잔액 충전 확인 후 재시도하거나 수동 승인이 필요합니다."
      />

      <DetailGrid>
        <Section title="환불 정보">
          <InfoCard padded>
            <InfoHeader>
              <Badge variant="danger" size="md">⚠️ 이상</Badge>
              <RefundId>{REFUND.refundId}</RefundId>
            </InfoHeader>

            <InfoBlock>
              <Row>
                <Label>신청일시</Label>
                <Value>{REFUND.requestedAt}</Value>
              </Row>
              <Row>
                <Label>환불 사유</Label>
                <Value>"{REFUND.reason}"</Value>
              </Row>
              <Row>
                <Label>예약 번호</Label>
                <Mono>{REFUND.bookingId}</Mono>
              </Row>
              <Row>
                <Label>결제 번호</Label>
                <Mono>{REFUND.paymentId}</Mono>
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
                <Value>{REFUND.paidAmount.toLocaleString()}원</Value>
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
                  <UserName>{REFUND.userName}</UserName>
                  <UserEmail>{REFUND.userEmail}</UserEmail>
                </UserMain>
              </UserHeader>
              <UserMeta>
                <Row>
                  <Label>연락처</Label>
                  <Value>{REFUND.userPhone}</Value>
                </Row>
              </UserMeta>
            </InfoCard>
          </Section>

          <Section title="예약 공간">
            <InfoCard padded>
              <SpaceHeader>
                <SpaceEmoji>{REFUND.spaceEmoji}</SpaceEmoji>
                <SpaceMain>
                  <SpaceName>{REFUND.spaceName}</SpaceName>
                  <Badge variant="sage" size="sm">{REFUND.spaceCategory}</Badge>
                </SpaceMain>
              </SpaceHeader>
              <SpaceMeta>
                <Row>
                  <Label>호스트</Label>
                  <Value>{REFUND.spaceHost}</Value>
                </Row>
                <Row>
                  <Label>체크인</Label>
                  <Value>{REFUND.checkInDate}</Value>
                </Row>
              </SpaceMeta>
            </InfoCard>
          </Section>

          <Section title="결제 정보">
            <InfoCard padded>
              <Row>
                <Label>결제 수단</Label>
                <Value>
                  <MethodChip>{REFUND.methodIcon}</MethodChip>
                  {REFUND.method}
                </Value>
              </Row>
              <Row>
                <Label>PG사</Label>
                <Value>{REFUND.pg}</Value>
              </Row>
              <Row>
                <Label>승인번호</Label>
                <Mono>{REFUND.approvalNo}</Mono>
              </Row>
            </InfoCard>
          </Section>
        </SideColumn>
      </DetailGrid>

      <RefundProcessHistory events={PROCESS_HISTORY} />

      <AdminMemoBox memo={memo} onChange={setMemo} savedMemos={SAVED_MEMOS} />

      <Actions>
        <ActionLeft>
          <Button variant="danger" onClick={handleReject}>
            ✗ 거절
          </Button>
        </ActionLeft>
        <ActionRight>
          <Button variant="secondary" onClick={handleRetry}>
            🔄 PG사 재시도
          </Button>
          <Button variant="primary" onClick={handleManualApprove}>
            ✓ 수동 승인 ({calc.refundAmount.toLocaleString()}원)
          </Button>
        </ActionRight>
      </Actions>
    </Page>
  )
}

const Page = styled.div`
  width: 100%;
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
