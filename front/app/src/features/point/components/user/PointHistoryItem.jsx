import styled, { css } from 'styled-components'

const TYPE_MAP = {
  earned: { sign: '+', color: 'var(--sage)', label: '적립', icon: '↑' },
  pending: { sign: '+', color: '#d4861f', label: '적립 예정', icon: '⏳' },
  used: { sign: '-', color: '#7A8B71', label: '사용', icon: '↓' },
  expired: { sign: '×', color: 'var(--gray-400)', label: '만료', icon: '×' },
  cancelled: { sign: '+', color: 'var(--gray-400)', label: '취소 복원', icon: '↺' },
}

export function PointHistoryItem({ entry }) {
  const type = TYPE_MAP[entry.type] || TYPE_MAP.earned
  const isNegative = entry.type === 'used' || entry.type === 'expired'

  return (
    <Wrap $expired={entry.type === 'expired'}>
      <TypeBadge $color={type.color}>
        {type.icon} {type.label}
      </TypeBadge>

      <Body>
        <Title>{entry.title}</Title>
        {entry.description && <Description>{entry.description}</Description>}
        <DateText>{entry.at}</DateText>
      </Body>

      <Right>
        <Amount $color={type.color} $negative={isNegative}>
          {type.sign}
          {Math.abs(entry.amount).toLocaleString()}
          <Unit>P</Unit>
        </Amount>
        {entry.balanceAfter !== undefined && (
          <BalanceAfter>잔액 {entry.balanceAfter.toLocaleString()}P</BalanceAfter>
        )}
      </Right>
    </Wrap>
  )
}

const Wrap = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  transition: all 200ms ease;

  &:hover {
    border-color: var(--sage);
  }

  ${(props) =>
    props.$expired &&
    css`
      opacity: 0.7;
    `}
`

const TypeBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: ${(props) => props.$color}1a;
  color: ${(props) => props.$color};
  border-radius: var(--radius-full);
  font-size: 0.72rem;
  font-weight: 600;
  flex-shrink: 0;
`

const Body = styled.div`
  flex: 1;
  min-width: 0;
`

const Title = styled.div`
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 2px;
`

const Description = styled.div`
  font-size: 0.75rem;
  color: var(--gray-600);
  margin-bottom: 4px;
`

const DateText = styled.div`
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--gray-400);
`

const Right = styled.div`
  text-align: right;
  flex-shrink: 0;
`

const Amount = styled.div`
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 600;
  color: ${(props) => props.$color};
  letter-spacing: -0.02em;
  margin-bottom: 2px;

  ${(props) =>
    props.$negative &&
    css`
      color: var(--gray-800);
    `}
`

const Unit = styled.span`
  font-size: 0.82rem;
  margin-left: 2px;
`

const BalanceAfter = styled.div`
  font-size: 0.72rem;
  color: var(--gray-400);
`
