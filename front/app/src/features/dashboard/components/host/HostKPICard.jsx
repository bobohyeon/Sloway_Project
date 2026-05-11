import styled, { css } from 'styled-components'

export function HostKPICard({
  label,
  value,
  unit,
  icon,
  delta,
  deltaType,
  subText,
  highlight,
}) {
  return (
    <Wrap $highlight={highlight}>
      <TopRow>
        <Label>{label}</Label>
        {icon && <Icon>{icon}</Icon>}
      </TopRow>

      <Value>
        <Number>{value}</Number>
        {unit && <Unit>{unit}</Unit>}
      </Value>

      <BottomRow>
        {delta && (
          <Delta $type={deltaType}>
            {deltaType === 'up' ? '↑' : deltaType === 'down' ? '↓' : ''} {delta}
          </Delta>
        )}
        {subText && <SubText>{subText}</SubText>}
      </BottomRow>
    </Wrap>
  )
}

const Wrap = styled.div`
  position: relative;
  padding: var(--space-5);
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
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

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
`

const Label = styled.div`
  font-size: 0.8rem;
  color: var(--gray-600);
  font-weight: 500;
`

const Icon = styled.div`
  font-size: 1.2rem;
  opacity: 0.7;
`

const Value = styled.div`
  display: flex;
  align-items: baseline;
  gap: 3px;
  margin-bottom: var(--space-2);
`

const Number = styled.strong`
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 500;
  color: var(--gray-800);
  letter-spacing: -0.02em;
`

const Unit = styled.span`
  font-size: 0.85rem;
  color: var(--gray-600);
`

const BottomRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

const Delta = styled.span`
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

const SubText = styled.span`
  font-size: 0.75rem;
  color: var(--gray-400);
`
