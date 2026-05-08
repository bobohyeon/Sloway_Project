import styled from 'styled-components'

export function QuickActionCard({ icon, title, description, onClick }) {
  return (
    <Wrap onClick={onClick}>
      <Icon>{icon}</Icon>
      <Body>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </Body>
      <Arrow>→</Arrow>
    </Wrap>
  )
}

const Wrap = styled.button`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
  padding: var(--space-4);
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  text-align: left;
  cursor: pointer;
  transition: all 200ms ease;

  &:hover {
    border-color: var(--sage);
    transform: translateY(-2px);
  }
`

const Icon = styled.div`
  width: 48px;
  height: 48px;
  background: var(--cream);
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

const Title = styled.div`
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 2px;
`

const Description = styled.div`
  font-size: 0.78rem;
  color: var(--gray-600);
`

const Arrow = styled.div`
  color: var(--gray-400);
  font-size: 1.2rem;
  transition: transform 200ms ease;

  ${Wrap}:hover & {
    transform: translateX(4px);
    color: var(--sage);
  }
`
