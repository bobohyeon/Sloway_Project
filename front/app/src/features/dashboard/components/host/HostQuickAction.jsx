import styled from 'styled-components'

export function HostQuickAction({ icon, title, description, count, onClick }) {
  return (
    <Wrap onClick={onClick}>
      <IconWrap>{icon}</IconWrap>
      <Body>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </Body>
      {count !== undefined && count > 0 && <Count>{count}</Count>}
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

const IconWrap = styled.div`
  width: 44px;
  height: 44px;
  background: var(--cream);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  flex-shrink: 0;
`

const Body = styled.div`
  flex: 1;
  min-width: 0;
`

const Title = styled.div`
  font-size: 0.92rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 2px;
`

const Description = styled.div`
  font-size: 0.75rem;
  color: var(--gray-600);
`

const Count = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 22px;
  padding: 0 8px;
  background: var(--sage);
  color: var(--white);
  border-radius: var(--radius-full);
  font-size: 0.72rem;
  font-weight: 600;
`

const Arrow = styled.div`
  color: var(--gray-400);
  font-size: 1.1rem;
  transition: transform 200ms ease;

  ${Wrap}:hover & {
    transform: translateX(4px);
    color: var(--sage);
  }
`
