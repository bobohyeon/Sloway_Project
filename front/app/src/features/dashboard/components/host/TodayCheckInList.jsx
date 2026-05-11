import styled from 'styled-components'
import { Card, Section, Button, EmptyState } from '../../../pay_shared/components'

export function TodayCheckInList({ items, onSeeAll, onClickItem }) {
  if (!items || items.length === 0) {
    return (
      <Section title="오늘 체크인">
        <EmptyState
          icon="🌿"
          title="오늘 체크인 예약이 없어요"
          description="여유로운 하루 보내세요"
        />
      </Section>
    )
  }

  return (
    <Section
      title="오늘 체크인"
      action={
        <Button variant="ghost" size="sm" onClick={onSeeAll}>
          전체 →
        </Button>
      }
    >
      <ListCard>
        {items.map((item) => (
          <ListItem key={item.id} onClick={() => onClickItem?.(item)}>
            <TimeBlock>
              <Time>{item.checkInTime}</Time>
              <Label>체크인</Label>
            </TimeBlock>

            <Body>
              <CustomerRow>
                <CustomerName>{item.customerName}</CustomerName>
                <GuestCount>외 {item.guestCount - 1}명</GuestCount>
              </CustomerRow>
              <Meta>
                <span>{item.spaceEmoji}</span>
                <span>{item.spaceName}</span>
                <Sep>·</Sep>
                <span>{item.nights}박</span>
              </Meta>
            </Body>

            <Arrow>→</Arrow>
          </ListItem>
        ))}
      </ListCard>
    </Section>
  )
}

const ListCard = styled(Card)`
  padding: 0;
  overflow: hidden;
`

const ListItem = styled.button`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
  padding: var(--space-4);
  background: var(--white);
  border: none;
  border-bottom: 1px solid var(--gray-200);
  text-align: left;
  cursor: pointer;
  transition: background 160ms ease;

  &:hover {
    background: var(--cream);
  }

  &:last-child {
    border-bottom: none;
  }
`

const TimeBlock = styled.div`
  width: 56px;
  padding: 6px 0;
  background: var(--cream);
  border-radius: var(--radius-md);
  text-align: center;
  flex-shrink: 0;
`

const Time = styled.div`
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--sage);
  letter-spacing: -0.02em;
`

const Label = styled.div`
  font-size: 0.65rem;
  color: var(--gray-600);
  margin-top: 1px;
`

const Body = styled.div`
  flex: 1;
  min-width: 0;
`

const CustomerRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 2px;
`

const CustomerName = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--gray-800);
`

const GuestCount = styled.span`
  font-size: 0.78rem;
  color: var(--gray-600);
`

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  color: var(--gray-600);
`

const Sep = styled.span`
  opacity: 0.4;
`

const Arrow = styled.span`
  color: var(--gray-400);
  font-size: 1.1rem;
  flex-shrink: 0;
`
