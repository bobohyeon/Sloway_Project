import styled from 'styled-components'
import { Card, Button, Checkbox } from '../../../pay_shared/components'

export function EligiblePaymentItem({ payment, selected, onSelect, onApply }) {
  return (
    <Wrap>
      <CheckboxWrap onClick={(e) => e.stopPropagation()}>
        <Checkbox checked={selected} onChange={() => onSelect(payment)} />
      </CheckboxWrap>

      <Emoji>{payment.spaceEmoji}</Emoji>

      <Body>
        <SpaceName>{payment.spaceName}</SpaceName>
        <Meta>
          <Mono>{payment.paymentId}</Mono>
          <Sep>·</Sep>
          <span>{payment.paidAt}</span>
        </Meta>
        <DDay>신청 가능 D-{payment.daysLeft}</DDay>
      </Body>

      <Right>
        <Amount>{payment.amount.toLocaleString()}원</Amount>
        <Button variant="primary" size="sm" onClick={() => onApply?.(payment)}>
          신청
        </Button>
      </Right>
    </Wrap>
  )
}

const Wrap = styled(Card)`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);

  &:hover {
    border-color: var(--sage);
  }
`

const CheckboxWrap = styled.div`
  display: flex;
  align-items: center;
`

const Emoji = styled.div`
  width: 44px;
  height: 44px;
  background: var(--gray-100);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
`

const Body = styled.div`
  flex: 1;
  min-width: 0;
`

const SpaceName = styled.div`
  font-size: 0.92rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Meta = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  font-size: 0.78rem;
  color: var(--gray-600);
  margin-bottom: 4px;
`

const Mono = styled.span`
  font-family: var(--font-mono);
`

const Sep = styled.span`
  opacity: 0.4;
`

const DDay = styled.div`
  display: inline-block;
  padding: 2px 8px;
  background: rgba(212, 134, 31, 0.15);
  color: #b8730f;
  border-radius: var(--radius-full);
  font-size: 0.72rem;
  font-weight: 600;
`

const Right = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  flex-shrink: 0;
`

const Amount = styled.div`
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--gray-800);
  letter-spacing: -0.02em;
`
