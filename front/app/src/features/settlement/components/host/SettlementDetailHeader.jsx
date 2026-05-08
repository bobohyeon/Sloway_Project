import styled from 'styled-components'
import { Card, Badge } from '../../../pay_shared/components'

export function SettlementDetailHeader({ settlement }) {
  const isCompleted = settlement.status === 'completed'

  return (
    <Wrap padded>
      <TopRow>
        <Status>
          <Badge variant={isCompleted ? 'success' : 'warning'} size="md">
            {isCompleted ? '✓ 정산 완료' : '⏳ 정산 예정'}
          </Badge>
          <SettlementId>{settlement.settlementId}</SettlementId>
        </Status>
      </TopRow>

      <SpaceRow>
        <SpaceEmoji>{settlement.spaceEmoji}</SpaceEmoji>
        <SpaceInfo>
          <SpaceName>{settlement.spaceName}</SpaceName>
          <SpaceMeta>
            <Badge variant="sage" size="sm">{settlement.category}</Badge>
            <span>{settlement.location}</span>
          </SpaceMeta>
        </SpaceInfo>
      </SpaceRow>

      <Divider />

      <PayoutSection>
        <PayoutLabel>호스트 입금액</PayoutLabel>
        <PayoutAmount>
          <Number>{settlement.payoutAmount.toLocaleString()}</Number>
          <Unit>원</Unit>
        </PayoutAmount>
        <PayoutDate>
          {isCompleted
            ? `${settlement.completedAt}에 ${settlement.bankName} (${settlement.maskedAccount})로 입금됐어요`
            : `${settlement.scheduledAt}에 ${settlement.bankName} (${settlement.maskedAccount})로 입금될 예정이에요`}
        </PayoutDate>
      </PayoutSection>
    </Wrap>
  )
}

const Wrap = styled(Card)`
  background: linear-gradient(135deg, var(--cream) 0%, var(--white) 100%);
`

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
`

const Status = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
`

const SettlementId = styled.span`
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--gray-600);
`

const SpaceRow = styled.div`
  display: flex;
  gap: var(--space-3);
  align-items: center;
  margin-bottom: var(--space-3);
`

const SpaceEmoji = styled.div`
  width: 56px;
  height: 56px;
  background: var(--white);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  flex-shrink: 0;
`

const SpaceInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const SpaceName = styled.div`
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 4px;
  letter-spacing: -0.01em;
`

const SpaceMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  color: var(--gray-600);
`

const Divider = styled.hr`
  border: none;
  border-top: 1px dashed var(--gray-200);
  margin: var(--space-4) 0;
`

const PayoutSection = styled.div`
  text-align: center;
`

const PayoutLabel = styled.div`
  font-size: 0.85rem;
  color: var(--gray-600);
  margin-bottom: var(--space-2);
`

const PayoutAmount = styled.div`
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 4px;
  margin-bottom: var(--space-2);
`

const Number = styled.strong`
  font-family: var(--font-display);
  font-size: 2.4rem;
  font-weight: 500;
  color: var(--sage);
  letter-spacing: -0.02em;
`

const Unit = styled.span`
  font-size: 1.1rem;
  color: var(--gray-600);
`

const PayoutDate = styled.div`
  font-size: 0.82rem;
  color: var(--gray-600);
`
