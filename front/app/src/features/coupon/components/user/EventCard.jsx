import styled, { css } from 'styled-components'
import { Card, Badge, Button } from '../../../pay_shared/components'
import { EventTimeBadge } from './EventTimeBadge'

export function EventCard({ event, onIssue, ended }) {
  const isFull = event.issuedCount >= event.totalQuantity
  const isAlreadyIssued = event.alreadyIssued
  const canIssue = !ended && !isFull && !isAlreadyIssued

  return (
    <Wrap $ended={ended}>
      <Header>
        <EventTag>
          <EventEmoji>{event.emoji}</EventEmoji>
          <EventName>{event.eventName}</EventName>
        </EventTag>
        <EventTimeBadge daysLeft={event.daysLeft} ended={ended} />
      </Header>

      <Body>
        <DiscountBox $ended={ended}>
          {event.discountType === 'percent' ? (
            <>
              <DiscountNumber>{event.discountValue}</DiscountNumber>
              <DiscountUnit>%</DiscountUnit>
            </>
          ) : (
            <>
              <DiscountNumber>{(event.discountValue / 1000).toFixed(0)}</DiscountNumber>
              <DiscountUnit>천원</DiscountUnit>
            </>
          )}
          <DiscountLabel>{event.discountType === 'percent' ? '할인' : '즉시 할인'}</DiscountLabel>
        </DiscountBox>

        <Info>
          <Title>{event.title}</Title>
          {event.category && (
            <CategoryWrap>
              <Badge variant="sage" size="sm">
                {event.category}
              </Badge>
            </CategoryWrap>
          )}
          <Period>{event.period}</Period>

          <ConditionList>
            {event.conditions.map((cond, i) => (
              <Condition key={i}>
                <Check>·</Check>
                {cond}
              </Condition>
            ))}
          </ConditionList>
        </Info>
      </Body>

      <Footer>
        <IssueStatus>
          <StatusLabel>
            {isFull ? '🔥 모두 발급 완료' : `남은 수량 ${(event.totalQuantity - event.issuedCount).toLocaleString()}개`}
          </StatusLabel>
          <ProgressBar>
            <ProgressFill $rate={(event.issuedCount / event.totalQuantity) * 100} $full={isFull} />
          </ProgressBar>
        </IssueStatus>

        {canIssue ? (
          <Button variant="primary" onClick={() => onIssue?.(event)}>
            🎁 쿠폰 받기
          </Button>
        ) : isAlreadyIssued ? (
          <Button variant="secondary" disabled>
            ✓ 발급 완료
          </Button>
        ) : isFull ? (
          <Button variant="secondary" disabled>
            마감
          </Button>
        ) : (
          <Button variant="secondary" disabled>
            종료
          </Button>
        )}
      </Footer>
    </Wrap>
  )
}

const Wrap = styled(Card)`
  padding: var(--space-5);
  transition: all 200ms ease;

  &:hover {
    border-color: var(--sage);
    transform: translateY(-1px);
  }

  ${(props) =>
    props.$ended &&
    css`
      opacity: 0.6;
      &:hover {
        transform: none;
        border-color: var(--gray-200);
      }
    `}
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
`

const EventTag = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

const EventEmoji = styled.span`
  font-size: 1.2rem;
`

const EventName = styled.span`
  font-family: var(--font-display);
  font-size: 0.92rem;
  font-weight: 500;
  color: var(--gray-800);
`

const Body = styled.div`
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-4);

  @media (max-width: 480px) {
    flex-direction: column;
    gap: var(--space-2);
  }
`

const DiscountBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 100px;
  padding: var(--space-3);
  background: ${(props) => (props.$ended ? 'var(--gray-100)' : 'var(--cream)')};
  border-radius: var(--radius-md);
  flex-shrink: 0;

  @media (max-width: 480px) {
    flex-direction: row;
    gap: 6px;
    padding: var(--space-2) var(--space-3);
  }
`

const DiscountNumber = styled.span`
  font-family: var(--font-display);
  font-size: 2.4rem;
  font-weight: 500;
  color: var(--sage);
  letter-spacing: -0.03em;
  line-height: 1;
`

const DiscountUnit = styled.span`
  font-family: var(--font-display);
  font-size: 1.1rem;
  color: var(--sage);
  margin-top: 4px;
`

const DiscountLabel = styled.span`
  font-size: 0.72rem;
  color: var(--gray-600);
  margin-top: 4px;
`

const Info = styled.div`
  flex: 1;
  min-width: 0;
`

const Title = styled.div`
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 6px;
  letter-spacing: -0.01em;
`

const CategoryWrap = styled.div`
  margin-bottom: 6px;
`

const Period = styled.div`
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--gray-600);
  margin-bottom: var(--space-2);
`

const ConditionList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 2px;
  list-style: none;
  padding: 0;
  margin: 0;
`

const Condition = styled.li`
  display: flex;
  gap: 4px;
  font-size: 0.78rem;
  color: var(--gray-600);
  line-height: 1.5;
`

const Check = styled.span`
  color: var(--sage);
  font-weight: 700;
  flex-shrink: 0;
`

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: var(--space-3);
  padding-top: var(--space-3);
  border-top: 1px dashed var(--gray-200);

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
`

const IssueStatus = styled.div`
  flex: 1;
  min-width: 0;
`

const StatusLabel = styled.div`
  font-size: 0.78rem;
  color: var(--gray-600);
  margin-bottom: 4px;
`

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: var(--gray-100);
  border-radius: var(--radius-full);
  overflow: hidden;
`

const ProgressFill = styled.div`
  height: 100%;
  width: ${(props) => props.$rate}%;
  background: ${(props) => (props.$full ? '#b85a4e' : 'var(--sage)')};
  transition: width 600ms ease;
`
