import styled, { css } from 'styled-components'

export function StatCard({ label, value, unit, icon, highlight }) {
  return (
    <Wrap $highlight={highlight}>
      {icon && <Icon>{icon}</Icon>}
      <Label>{label}</Label>
      <Value>
        <strong>{value}</strong>
        {unit && <Unit>{unit}</Unit>}
      </Value>
    </Wrap>
  )
}

const Wrap = styled.div`
  position: relative;
  padding: var(--space-5);
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all 200ms ease;

  &:hover {
    border-color: var(--sage);
    transform: translateY(-2px);
  }

  ${(props) =>
    props.$highlight &&
    css`
      background: var(--cream);
      border-color: var(--sage);
    `}
`

const Icon = styled.div`
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  font-size: 1.3rem;
  opacity: 0.6;
`

const Label = styled.div`
  font-size: 0.78rem;
  color: var(--gray-400);
  font-weight: 500;
  margin-bottom: var(--space-2);
`

const Value = styled.div`
  display: flex;
  align-items: baseline;
  gap: 3px;

  strong {
    font-family: var(--font-display);
    font-size: 1.6rem;
    font-weight: 500;
    color: var(--gray-800);
    letter-spacing: -0.02em;
  }
`

const Unit = styled.span`
  font-size: 0.85rem;
  color: var(--gray-600);
`
