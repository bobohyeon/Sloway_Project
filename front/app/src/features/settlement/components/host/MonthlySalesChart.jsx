import { useState } from 'react'
import styled from 'styled-components'
import { Card, Section, Tabs } from '../../../pay_shared/components'

export function MonthlySalesChart({ data }) {
  const [period, setPeriod] = useState('6months')

  const filtered = period === '6months' ? data.slice(-6) : data

  const maxValue = Math.max(...filtered.map((d) => d.amount))
  const chartHeight = 220
  const barWidth = 100 / filtered.length
  const padding = barWidth * 0.2

  return (
    <Section
      title="월별 매출 추이"
      action={
        <Tabs
          items={[
            { value: '6months', label: '6개월' },
            { value: '12months', label: '12개월' },
          ]}
          value={period}
          onChange={setPeriod}
        />
      }
    >
      <ChartCard padded>
        <ChartWrap>
          <YAxisLabels>
            <YLabel>{(maxValue / 10000).toFixed(0)}만</YLabel>
            <YLabel>{((maxValue * 0.5) / 10000).toFixed(0)}만</YLabel>
            <YLabel>0</YLabel>
          </YAxisLabels>

          <ChartArea>
            <GridLines>
              <GridLine style={{ top: '0%' }} />
              <GridLine style={{ top: '50%' }} />
              <GridLine style={{ top: '100%' }} />
            </GridLines>

            <SvgWrap viewBox={`0 0 100 ${chartHeight}`} preserveAspectRatio="none">
              {filtered.map((item, i) => {
                const heightRatio = (item.amount / maxValue) * 0.95
                const barHeight = heightRatio * chartHeight
                const x = i * barWidth + padding
                const y = chartHeight - barHeight
                const width = barWidth - padding * 2
                const isCurrent = i === filtered.length - 1

                return (
                  <g key={item.month}>
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={barHeight}
                      fill={isCurrent ? '#A8B89F' : '#C5D1BD'}
                      rx="0.6"
                    >
                      <title>
                        {item.month}: {item.amount.toLocaleString()}원
                      </title>
                    </rect>
                  </g>
                )
              })}
            </SvgWrap>
          </ChartArea>
        </ChartWrap>

        <XAxisLabels>
          {filtered.map((item, i) => {
            const isCurrent = i === filtered.length - 1
            return (
              <XLabel key={item.month} $current={isCurrent}>
                {item.month}
              </XLabel>
            )
          })}
        </XAxisLabels>

        <ChartFooter>
          <FooterItem>
            <Dot $color="#A8B89F" />
            <span>이번 달</span>
          </FooterItem>
          <FooterItem>
            <Dot $color="#C5D1BD" />
            <span>이전 달</span>
          </FooterItem>
        </ChartFooter>
      </ChartCard>
    </Section>
  )
}

const ChartCard = styled(Card)``

const ChartWrap = styled.div`
  display: flex;
  gap: var(--space-3);
  height: 240px;
  margin-bottom: var(--space-2);
`

const YAxisLabels = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4px 0;
  flex-shrink: 0;
`

const YLabel = styled.span`
  font-size: 0.7rem;
  color: var(--gray-400);
  font-family: var(--font-mono);
`

const ChartArea = styled.div`
  flex: 1;
  position: relative;
  border-left: 1px solid var(--gray-200);
  border-bottom: 1px solid var(--gray-200);
  padding: 4px 0;
`

const GridLines = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
`

const GridLine = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--gray-200);
  opacity: 0.5;

  &:first-child {
    opacity: 0;
  }
`

const SvgWrap = styled.svg`
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
`

const XAxisLabels = styled.div`
  display: flex;
  padding-left: 30px;
  margin-bottom: var(--space-3);
`

const XLabel = styled.div`
  flex: 1;
  text-align: center;
  font-size: 0.72rem;
  color: ${(props) => (props.$current ? 'var(--sage)' : 'var(--gray-600)')};
  font-weight: ${(props) => (props.$current ? 600 : 400)};
`

const ChartFooter = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--space-4);
  padding-top: var(--space-3);
  border-top: 1px dashed var(--gray-200);
`

const FooterItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  color: var(--gray-600);
`

const Dot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 2px;
  background: ${(props) => props.$color};
`
