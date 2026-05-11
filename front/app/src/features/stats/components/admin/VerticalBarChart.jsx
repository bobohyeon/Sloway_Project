import { useState } from 'react'
import styled from 'styled-components'
import { Card, Section } from '../../../pay_shared/components'

export function VerticalBarChart({ title, data, formatValue, action }) {
  const [hoveredIdx, setHoveredIdx] = useState(null)
  const max = Math.max(...data.map((d) => d.value))

  return (
    <Section title={title} action={action}>
      <ChartCard padded>
        <ChartArea>
          {data.map((item, i) => {
            const heightPct = (item.value / max) * 100
            const isHovered = hoveredIdx === i
            return (
              <ColumnWrap key={i}>
                <ValueLabel $show={isHovered}>
                  {formatValue ? formatValue(item.value) : item.value.toLocaleString()}
                </ValueLabel>
                <BarColumn
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  <Bar
                    $height={heightPct}
                    $color={item.color}
                    $highlight={item.highlight}
                    $hovered={isHovered}
                  />
                </BarColumn>
                <XLabel $highlight={item.highlight}>{item.label}</XLabel>
              </ColumnWrap>
            )
          })}
        </ChartArea>
      </ChartCard>
    </Section>
  )
}

const ChartCard = styled(Card)``

const ChartArea = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 6px;
  min-height: 240px;
  padding: var(--space-2) 0;
`

const ColumnWrap = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
`

const ValueLabel = styled.div`
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--gray-800);
  font-weight: 600;
  height: 20px;
  margin-bottom: 4px;
  opacity: ${(props) => (props.$show ? 1 : 0)};
  transition: opacity 160ms ease;
`

const BarColumn = styled.div`
  width: 100%;
  height: 180px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  cursor: pointer;
`

const Bar = styled.div`
  width: 100%;
  max-width: 40px;
  height: ${(props) => props.$height}%;
  background: ${(props) =>
    props.$highlight ? 'var(--sage)' : props.$color || '#C5D1BD'};
  border-radius: 4px 4px 0 0;
  transition: all 200ms ease;
  opacity: ${(props) => (props.$hovered ? 1 : 0.85)};
  transform: scaleY(${(props) => (props.$hovered ? 1.02 : 1)});
  transform-origin: bottom;
`

const XLabel = styled.span`
  margin-top: 6px;
  font-size: 0.75rem;
  color: ${(props) => (props.$highlight ? 'var(--sage)' : 'var(--gray-600)')};
  font-weight: ${(props) => (props.$highlight ? 600 : 400)};
  text-align: center;
`
