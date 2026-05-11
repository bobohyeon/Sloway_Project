import styled, { css } from 'styled-components'
import { Card, Section } from '../../../pay_shared/components'

export function RefundProcessHistory({ events }) {
  return (
    <Section title="처리 이력">
      <TimelineCard padded>
        {events.map((ev, i) => (
          <TimelineItem key={i} $isLast={i === events.length - 1}>
            <DotWrap>
              <Dot $status={ev.status}>
                {ev.status === 'done' ? '✓' : ev.status === 'error' ? '✗' : '⏳'}
              </Dot>
              {i < events.length - 1 && <Connector $done={ev.status === 'done'} />}
            </DotWrap>

            <Content>
              <ItemTitle $status={ev.status}>{ev.title}</ItemTitle>
              {ev.description && <ItemDesc>{ev.description}</ItemDesc>}
              <ItemFooter>
                {ev.at && <ItemTime>{ev.at}</ItemTime>}
                {ev.actor && (
                  <>
                    <Sep>·</Sep>
                    <ItemActor>{ev.actor}</ItemActor>
                  </>
                )}
              </ItemFooter>
            </Content>
          </TimelineItem>
        ))}
      </TimelineCard>
    </Section>
  )
}

const TimelineCard = styled(Card)``

const TimelineItem = styled.div`
  display: flex;
  gap: var(--space-4);
  padding-bottom: ${(props) => (props.$isLast ? '0' : 'var(--space-3)')};
`

const DotWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
`

const Dot = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 600;
  background: var(--gray-100);
  color: var(--gray-400);
  flex-shrink: 0;

  ${(props) =>
    props.$status === 'done' &&
    css`
      background: var(--sage);
      color: var(--white);
    `}

  ${(props) =>
    props.$status === 'error' &&
    css`
      background: #b85a4e;
      color: var(--white);
    `}

  ${(props) =>
    props.$status === 'active' &&
    css`
      background: var(--white);
      color: var(--sage);
      border: 2px solid var(--sage);
    `}
`

const Connector = styled.div`
  flex: 1;
  width: 2px;
  background: ${(props) => (props.$done ? 'var(--sage)' : 'var(--gray-200)')};
  margin-top: 4px;
  min-height: 20px;
`

const Content = styled.div`
  flex: 1;
  padding-bottom: var(--space-3);
`

const ItemTitle = styled.div`
  font-size: 0.92rem;
  font-weight: 500;
  color: ${(props) =>
    props.$status === 'pending'
      ? 'var(--gray-400)'
      : props.$status === 'error'
      ? '#a04c42'
      : 'var(--gray-800)'};
  margin-bottom: 4px;
`

const ItemDesc = styled.div`
  font-size: 0.82rem;
  color: var(--gray-600);
  line-height: 1.5;
  margin-bottom: 4px;
`

const ItemFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  color: var(--gray-400);
`

const ItemTime = styled.span`
  font-family: var(--font-mono);
`

const Sep = styled.span`
  opacity: 0.5;
`

const ItemActor = styled.span`
  color: var(--gray-600);
`
