import { useState } from 'react'
import styled from 'styled-components'
import { Card, Section, Tabs } from '../../../pay_shared/components'

export function DailyTransactionChart({ data }) {
  const [period, setPeriod] = useState('7days')
  const [hoveredIdx, setHoveredIdx] = useState(null)

  const sliceMap = { '7days': 7, '30days': 30, '90days': 90 }
  const slice = sliceMap[period] || 7
  const filtered = data.slice(-slice)

  const maxRevenue = Math.max(...filtered.map((d) => d.revenue))
  const maxBookings = Math.max(...filtered.map((d) => d.bookings))

  const chartW = 800
  const chartH = 240
  const paddingX = 20
  const paddingY = 16

  const xStep = (chartW - paddingX * 2) / (filtered.length - 1 || 1)

  const revenuePoints = filtered.map((d, i) => {
    const x = paddingX + i * xStep
    const y = paddingY + (chartH - paddingY * 2) * (1 - d.revenue / maxRevenue)
    return { x, y, data: d, i }
  })

  const bookingsPoints = filtered.map((d, i) => {
    const x = paddingX + i * xStep
    const y = paddingY + (chartH - paddingY * 2) * (1 - d.bookings / maxBookings)
    return { x, y, data: d, i }
  })

  const buildPath = (points) => points.map((p, i) => (i === 0 ? 'M' : 'L') + p.x + ',' + p.y).join(' ')

  const buildArea = (points) => {
    const baseY = chartH - paddingY
    return (
      'M' + points[0].x + ',' + baseY + ' ' +
      points.map((p) => 'L' + p.x + ',' + p.y).join(' ') +
      ' L' + points[points.length - 1].x + ',' + baseY + ' Z'
    )
  }

  return (
    <Section
      title="일별 거래 추이"
      action={
        <Tabs
          items={[
            { value: '7days', label: '7일' },
            { value: '30days', label: '30일' },
            { value: '90days', label: '90일' },
          ]}
          value={period}
          onChange={setPeriod}
        />
      }
    >
      <ChartCard padded>
        <Legend>
          <LegendItem>
            <LegendDot $color="#7A8B71" />
            <span>매출 (만원)</span>
          </LegendItem>
          <LegendItem>
            <LegendDot $color="#C5D1BD" />
            <span>예약 건수</span>
          </LegendItem>
        </Legend>

        <ChartWrap>
          <SvgWrap viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="xMidYMid meet">
            <line
              x1={paddingX}
              y1={paddingY}
              x2={chartW - paddingX}
              y2={paddingY}
              stroke="#E5E5E5"
              strokeDasharray="2,4"
            />
            <line
              x1={paddingX}
              y1={chartH / 2}
              x2={chartW - paddingX}
              y2={chartH / 2}
              stroke="#E5E5E5"
              strokeDasharray="2,4"
            />
            <line
              x1={paddingX}
              y1={chartH - paddingY}
              x2={chartW - paddingX}
              y2={chartH - paddingY}
              stroke="#E5E5E5"
            />

            <path d={buildArea(revenuePoints)} fill="rgba(122, 139, 113, 0.12)" />

            <path
              d={buildPath(bookingsPoints)}
              fill="none"
              stroke="#C5D1BD"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path
              d={buildPath(revenuePoints)}
              fill="none"
              stroke="#7A8B71"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {revenuePoints.map((p) => (
              <g key={'r' + p.i}>
                {hoveredIdx === p.i && (
                  <circle cx={p.x} cy={p.y} r="6" fill="#7A8B71" opacity="0.2" />
                )}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={hoveredIdx === p.i ? '5' : '3'}
                  fill="#7A8B71"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  style={{ cursor: 'pointer', transition: 'r 160ms ease' }}
                  onMouseEnter={() => setHoveredIdx(p.i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              </g>
            ))}

            {hoveredIdx !== null && (
              <g>
                <rect
                  x={Math.min(revenuePoints[hoveredIdx].x - 65, chartW - 140)}
                  y={Math.max(revenuePoints[hoveredIdx].y - 56, 4)}
                  width="130"
                  height="50"
                  rx="6"
                  fill="#1A1A1A"
                  opacity="0.9"
                />
                <text
                  x={Math.min(revenuePoints[hoveredIdx].x, chartW - 75)}
                  y={Math.max(revenuePoints[hoveredIdx].y - 36, 24)}
                  fill="#FFFFFF"
                  fontSize="11"
                  textAnchor="middle"
                  fontWeight="600"
                >
                  {filtered[hoveredIdx].date}
                </text>
                <text
                  x={Math.min(revenuePoints[hoveredIdx].x, chartW - 75)}
                  y={Math.max(revenuePoints[hoveredIdx].y - 22, 38)}
                  fill="#A8B89F"
                  fontSize="10"
                  textAnchor="middle"
                >
                  매출 {(filtered[hoveredIdx].revenue / 10000).toFixed(0)}만원
                </text>
                <text
                  x={Math.min(revenuePoints[hoveredIdx].x, chartW - 75)}
                  y={Math.max(revenuePoints[hoveredIdx].y - 10, 50)}
                  fill="#C5D1BD"
                  fontSize="10"
                  textAnchor="middle"
                >
                  예약 {filtered[hoveredIdx].bookings}건
                </text>
              </g>
            )}
          </SvgWrap>
        </ChartWrap>

        <XAxis>
          {filtered.map((d, i) => {
            const show = period === '7days' || i % Math.floor(filtered.length / 7) === 0
            return (
              <XLabel key={i} $show={show}>
                {show ? d.date.slice(5) : ''}
              </XLabel>
            )
          })}
        </XAxis>
      </ChartCard>
    </Section>
  )
}

const ChartCard = styled(Card)``

const Legend = styled.div`
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-3);
  font-size: 0.78rem;
  color: var(--gray-600);
`

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

const LegendDot = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background: ${(props) => props.$color};
`

const ChartWrap = styled.div`
  width: 100%;
  height: 240px;
`

const SvgWrap = styled.svg`
  width: 100%;
  height: 100%;
`

const XAxis = styled.div`
  display: flex;
  padding: 4px 20px 0;
`

const XLabel = styled.span`
  flex: 1;
  text-align: center;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--gray-400);
  opacity: ${(props) => (props.$show ? 1 : 0)};
`
