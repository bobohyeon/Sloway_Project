import styled, { css } from 'styled-components'
import { Card } from '../../../pay_shared/components'

export function PointStatsRow({ totalEarned, totalUsed, totalExpired }) {
  return (
    <Wrap>
      <StatBox padded>
        <Label>
          <Icon $color="var(--sage)">↑</Icon>총 적립
        </Label>
        <Value $color="var(--sage)">{totalEarned.toLocaleString()}P</Value>
      </StatBox>

      <StatBox padded>
        <Label>
          <Icon $color="#7A8B71">↓</Icon>총 사용
        </Label>
        <Value>{totalUsed.toLocaleString()}P</Value>
      </StatBox>

      <StatBox padded>
        <Label>
          <Icon $color="var(--gray-400)">×</Icon>총 만료
        </Label>
        <Value $muted>{totalExpired.toLocaleString()}P</Value>
      </StatBox>
    </Wrap>
  )
}

const Wrap = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`

const StatBox = styled(Card)`
  transition: all 200ms ease;

  &:hover {
    border-color: var(--sage);
  }
`

const Label = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  color: var(--gray-600);
  margin-bottom: 6px;
`

const Icon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: ${(props) => props.$color}33;
  color: ${(props) => props.$color};
  border-radius: 50%;
  font-size: 0.78rem;
  font-weight: 700;
`

const Value = styled.div`
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 500;
  color: ${(props) => props.$color || 'var(--gray-800)'};
  letter-spacing: -0.02em;

  ${(props) =>
    props.$muted &&
    css`
      color: var(--gray-400);
    `}
`
