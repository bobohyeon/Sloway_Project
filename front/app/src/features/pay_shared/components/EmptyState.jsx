import styled from 'styled-components'

export function EmptyState({ icon = '🌱', title, description, action }) {
  return (
    <Wrap>
      <Icon>{icon}</Icon>
      <Title>{title}</Title>
      {description && <Description>{description}</Description>}
      {action && <ActionWrap>{action}</ActionWrap>}
    </Wrap>
  )
}

const Wrap = styled.div`
  padding: var(--space-12) var(--space-6);
  text-align: center;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
`

const Icon = styled.div`
  font-size: 3rem;
  margin-bottom: var(--space-3);
  opacity: 0.7;
`

const Title = styled.div`
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: var(--space-2);
`

const Description = styled.div`
  font-size: 0.88rem;
  color: var(--gray-600);
  line-height: 1.6;
  margin-bottom: var(--space-4);
`

const ActionWrap = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--space-2);
  margin-top: var(--space-4);
`
