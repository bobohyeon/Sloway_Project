import styled, { css } from 'styled-components'
import { Card, Section } from '../../../pay_shared/components'

export function RefundTimeline({ events }) {
  return (
    <Section title="진행 타임라인">
      <TimelineCard padded>
        {events.map((ev, i) => (
          <TimelineItem key={i} $isLast={i === events.length - 1}>
            <DotWrap>
              <Dot $status={ev.status}>
                {ev.status === 'done' ? '✓' : ev.status === 'active' ? '⏳' : ''}
              </Dot>
              {i < events.length - 1 && <Connector $done={ev.status === 'done'} />}
            </DotWrap>

            <Content>
              <ItemTitle $status={ev.status}>{ev.title}</ItemTitle>
              {ev.description && <ItemDesc>{ev.description}</ItemDesc>}
              {ev.at && <ItemTime>{ev.at}</ItemTime>}
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
  padding-bottom: ${(props) => (props.$isLast ? '0' : 'var(--space-4)')};
`

const DotWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
`

const Dot = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.78rem;
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
    props.$status === 'active' &&
    css`
      background: var(--white);
      color: var(--sage);
      border: 2px solid var(--sage);
      animation: pulse 1.6s ease-in-out infinite;

      @keyframes pulse {
        0%, 100% {
          box-shadow: 0 0 0 0 rgba(168, 184, 159, 0.4);
        }
        50% {
          box-shadow: 0 0 0 6px rgba(168, 184, 159, 0.1);
        }
      }
    `}
`

const Connector = styled.div`
  flex: 1;
  width: 2px;
  background: ${(props) => (props.$done ? 'var(--sage)' : 'var(--gray-200)')};
  margin-top: 4px;
  min-height: 24px;
`

const Content = styled.div`
  flex: 1;
  padding-bottom: var(--space-3);
`

const ItemTitle = styled.div`
  font-size: 0.92rem;
  font-weight: 500;
  color: ${(props) => (props.$status === 'pending' ? 'var(--gray-400)' : 'var(--gray-800)')};
  margin-bottom: 4px;

  ${(props) =>
    props.$status === 'active' &&
    css`
      color: var(--sage);
      font-weight: 600;
    `}
`

const ItemDesc = styled.div`
  font-size: 0.82rem;
  color: var(--gray-600);
  line-height: 1.5;
  margin-bottom: 4px;
`

const ItemTime = styled.div`
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--gray-400);
`
