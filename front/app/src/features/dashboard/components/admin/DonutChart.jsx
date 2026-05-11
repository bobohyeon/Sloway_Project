import { useState } from 'react'
import styled from 'styled-components'
import { Card, Section } from '../../../pay_shared/components'

const DEFAULT_COLORS = ['#7A8B71', '#A8B89F', '#C5D1BD', '#E2E8DC', '#D4861F', '#B85A4E']

export function DonutChart({ title, data, totalLabel = '합계', totalUnit = '원', formatTotal }) {
  const [hoveredIdx, setHoveredIdx] = useState(null)

  const total = data.reduce((sum, d) => sum + d.value, 0)
  const size = 200
  const radius = 80
  const strokeWidth = 32
  const center = size / 2

  let cumulative = 0
  const slices = data.map((d, i) => {
    const startAngle = (cumulative / total) * 360
    cumulative += d.value
    const endAngle = (cumulative / total) * 360

    const startRad = ((startAngle - 90) * Math.PI) / 180
    const endRad = ((endAngle - 90) * Math.PI) / 180
    const largeArc = endAngle - startAngle > 180 ? 1 : 0

    const x1 = center + radius * Math.cos(startRad)
    const y1 = center + radius * Math.sin(startRad)
    const x2 = center + radius * Math.cos(endRad)
    const y2 = center + radius * Math.sin(endRad)

    const pct = ((d.value / total) * 100).toFixed(1)

    return {
      ...d,
      i,
      color: d.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length],
      pct,
      path: `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
    }
  })

  const displayTotal = formatTotal ? formatTotal(total) : total.toLocaleString()

  return (
    <Section title={title}>
      <ChartCard padded>
        <ChartLayout>
          <SvgWrap viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
            {slices.map((s) => (
              <path
                key={s.i}
                d={s.path}
                fill="none"
                stroke={s.color}
                strokeWidth={hoveredIdx === s.i ? strokeWidth + 6 : strokeWidth}
                style={{ cursor: 'pointer', transition: 'stroke-width 160ms ease' }}
                onMouseEnter={() => setHoveredIdx(s.i)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            ))}

            <text x={center} y={center - 6} textAnchor="middle" fontSize="11" fill="#999">
              {hoveredIdx !== null ? slices[hoveredIdx].label : totalLabel}
            </text>
            <text
              x={center}
              y={center + 14}
              textAnchor="middle"
              fontSize="18"
              fontWeight="600"
              fill="#1A1A1A"
              fontFamily="var(--font-display)"
            >
              {hoveredIdx !== null
                ? `${slices[hoveredIdx].pct}%`
                : displayTotal}
            </text>
            <text x={center} y={center + 30} textAnchor="middle" fontSize="10" fill="#999">
              {hoveredIdx !== null
                ? (formatTotal
                    ? formatTotal(slices[hoveredIdx].value)
                    : slices[hoveredIdx].value.toLocaleString()) + totalUnit
                : totalUnit}
            </text>
          </SvgWrap>

          <LegendList>
            {slices.map((s) => (
              <LegendItem
                key={s.i}
                $active={hoveredIdx === s.i}
                onMouseEnter={() => setHoveredIdx(s.i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <LegendDot $color={s.color} />
                <LegendName>{s.label}</LegendName>
                <LegendPct>{s.pct}%</LegendPct>
              </LegendItem>
            ))}
          </LegendList>
        </ChartLayout>
      </ChartCard>
    </Section>
  )
}

const ChartCard = styled(Card)``

const ChartLayout = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-5);

  @media (max-width: 640px) {
    flex-direction: column;
    gap: var(--space-3);
  }
`

const SvgWrap = styled.svg`
  flex-shrink: 0;
`

const LegendList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
`

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background 160ms ease;
  background: ${(props) => (props.$active ? 'var(--cream)' : 'transparent')};

  &:hover {
    background: var(--cream);
  }
`

const LegendDot = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background: ${(props) => props.$color};
  flex-shrink: 0;
`

const LegendName = styled.span`
  flex: 1;
  font-size: 0.82rem;
  color: var(--gray-800);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const LegendPct = styled.span`
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--gray-600);
  font-weight: 600;
`
