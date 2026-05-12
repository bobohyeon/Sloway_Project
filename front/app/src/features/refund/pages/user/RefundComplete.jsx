import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import PageLayout from '../../../../app/layouts/page/PageLayout'

import { Button, Card, Section } from '../../../pay_shared/components'
import { ResultHeader } from '../../../pay/components/user/ResultHeader'
import { RefundInfoCard } from '../../components/user/RefundInfoCard'

const REFUND = {
  refundId: 'RFD-20260424-00847',
  bookingId: 'SW-20260508-000847',
  spaceName: '청평 숲속 파인뷰 스테이',
  spaceEmoji: '🌲',
  amount: 326500,
  rate: 100,
  method: '카카오페이',
  methodIcon: '💬',
  requestedAt: '2026.04.24 14:32',
  expectedDepositAt: '4월 29일 (영업일 기준)',
  reason: '일정이 변경됐어요',
}

export default function RefundComplete() {
  const nav = useNavigate()

  return (
    <PageLayout maxWidth={800}>
      <ResultHeader
        variant="success"
        title="환불이 완료됐어요"
        description={`영업일 3~7일 내 ${REFUND.method}로 입금됩니다. 입금 완료되면 알림으로 안내드릴게요.`}
      />

      <Content>
        <SpaceCard>
          <SpaceEmoji>{REFUND.spaceEmoji}</SpaceEmoji>
          <SpaceInfo>
            <SpaceName>{REFUND.spaceName}</SpaceName>
            <SpaceMeta>예약번호: {REFUND.bookingId}</SpaceMeta>
          </SpaceInfo>
        </SpaceCard>

        <RefundInfoCard refund={REFUND} />

        <Section title="환불 사유">
          <ReasonCard padded>
            <ReasonLabel>고객님이 작성하신 사유</ReasonLabel>
            <ReasonText>"{REFUND.reason}"</ReasonText>
          </ReasonCard>
        </Section>

        <NoticeBox>
          <NoticeIcon>💡</NoticeIcon>
          <NoticeContent>
            <NoticeTitle>환불 처리에 대해 알려드려요</NoticeTitle>
            <NoticeList>
              <li>카드사 정책에 따라 입금까지 영업일 기준 3~7일이 소요돼요</li>
              <li>주말·공휴일은 영업일에 포함되지 않아요</li>
              <li>입금이 늦어지거나 문제가 생기면 알림으로 안내드려요</li>
              <li>긴급 문의는 고객센터로 연락해주세요</li>
            </NoticeList>
          </NoticeContent>
        </NoticeBox>
      </Content>

      <Actions>
        <Button variant="secondary" onClick={() => nav('/user/payment')}>
          결제 내역으로
        </Button>
        <Button variant="primary" onClick={() => alert('고객센터: 1588-0000')}>
          💬 고객센터 문의
        </Button>
      </Actions>
    </PageLayout>
  )
}
const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
`

const SpaceCard = styled(Card)`
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
`

const SpaceEmoji = styled.div`
  width: 56px;
  height: 56px;
  background: var(--gray-100);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  flex-shrink: 0;
`

const SpaceInfo = styled.div`
  flex: 1;
`

const SpaceName = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 4px;
`

const SpaceMeta = styled.div`
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--gray-400);
`

const ReasonCard = styled(Card)`
  background: var(--cream);
`

const ReasonLabel = styled.div`
  font-size: 0.78rem;
  color: var(--gray-600);
  margin-bottom: 6px;
`

const ReasonText = styled.div`
  font-size: 0.95rem;
  color: var(--gray-800);
  font-style: italic;
`

const NoticeBox = styled.div`
  display: flex;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--gray-100);
  border-radius: var(--radius-md);
`

const NoticeIcon = styled.div`
  font-size: 1.3rem;
  flex-shrink: 0;
`

const NoticeContent = styled.div`
  flex: 1;
`

const NoticeTitle = styled.div`
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 6px;
`

const NoticeList = styled.ul`
  list-style: disc;
  padding-left: 20px;
  font-size: 0.82rem;
  color: var(--gray-600);
  line-height: 1.7;

  li {
    list-style: disc;
  }
`

const Actions = styled.div`
  display: flex;
  gap: var(--space-3);
  justify-content: center;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`
