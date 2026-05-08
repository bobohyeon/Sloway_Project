import styled, { css } from 'styled-components'

export function SettlementStatCard({
  label,
  value,
  unit = '원',
  icon,
  highlight,
  delta,
  deltaType,
  subText,
}) {
  return (
    <Wrap $highlight={highlight}>
      {icon && <Icon>{icon}</Icon>}
      <Label>{label}</Label>
      <Value>
        <Number>{value}</Number>
        <Unit>{unit}</Unit>
      </Value>
      {delta && (
        <Delta $type={deltaType}>
          {deltaType === 'up' ? '↑' : deltaType === 'down' ? '↓' : ''} {delta}
        </Delta>
      )}
      {subText && <SubText>{subText}</SubText>}
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
  font-size: 1.4rem;
  opacity: 0.7;
`

const Label = styled.div`
  font-size: 0.78rem;
  color: var(--gray-600);
  font-weight: 500;
  margin-bottom: var(--space-2);
`

const Value = styled.div`
  display: flex;
  align-items: baseline;
  gap: 3px;
  margin-bottom: 6px;
`

const Number = styled.strong`
  font-family: var(--font-display);
  font-size: 1.55rem;
  font-weight: 500;
  color: var(--gray-800);
  letter-spacing: -0.02em;
`

const Unit = styled.span`
  font-size: 0.85rem;
  color: var(--gray-600);
`

const Delta = styled.div`
  font-size: 0.78rem;
  font-weight: 600;

  ${(props) =>
    props.$type === 'up' &&
    css`
      color: var(--sage);
    `}

  ${(props) =>
    props.$type === 'down' &&
    css`
      color: #b85a4e;
    `}

  ${(props) =>
    !props.$type &&
    css`
      color: var(--gray-600);
    `}
`

const SubText = styled.div`
  font-size: 0.75rem;
  color: var(--gray-400);
  margin-top: 2px;
`
