import styled from 'styled-components'
import { Section, Card, Badge } from '../../../pay_shared/components'

export function RefundMethodCard({ method }) {
  return (
    <Section title="환불 처리 방식">
      <MethodCard>
        <Header>
          <Icon style={{ background: method.bg, color: method.color }}>
            {method.icon}
          </Icon>
          <HeaderBody>
            <MethodName>{method.name} 자동 환불</MethodName>
            <MethodDesc>{method.desc}</MethodDesc>
          </HeaderBody>
          <Badge variant="success" size="sm">
            {method.processingType}
          </Badge>
        </Header>

        <TimeBox>
          <span>⏱️</span>
          <span>
            환불 소요 시간: <strong>{method.duration}</strong>
          </span>
        </TimeBox>
      </MethodCard>
    </Section>
  )
}

const MethodCard = styled(Card)`
  padding: var(--space-5);
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
`

const Icon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 700;
  flex-shrink: 0;
  border: 1px solid var(--gray-200);
`

const HeaderBody = styled.div`
  flex: 1;
  min-width: 0;
`

const MethodName = styled.div`
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 2px;
`

const MethodDesc = styled.div`
  font-size: 0.78rem;
  color: var(--gray-600);
`

const TimeBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: var(--space-3);
  background: var(--cream);
  border-radius: var(--radius-md);
  font-size: 0.82rem;
  color: var(--gray-600);

  strong {
    color: var(--gray-800);
    font-weight: 600;
  }
`
