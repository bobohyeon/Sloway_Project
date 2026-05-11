import styled from 'styled-components'
import { Card, Section } from '../../../pay_shared/components'

export function HorizontalBarChart({ title, data, formatValue, action }) {
  const max = Math.max(...data.map((d) => d.value))

  return (
    <Section title={title} action={action}>
      <ChartCard padded>
        <List>
          {data.map((item, i) => {
            const pct = (item.value / max) * 100
            return (
              <Row key={i}>
                <LabelGroup>
                  {item.icon && <ItemIcon>{item.icon}</ItemIcon>}
                  <Label>{item.label}</Label>
                </LabelGroup>
                <BarWrap>
                  <Bar $width={pct} $color={item.color} />
                </BarWrap>
                <ValueGroup>
                  <Value>{formatValue ? formatValue(item.value) : item.value.toLocaleString()}</Value>
                  {item.subValue && <SubValue>{item.subValue}</SubValue>}
                </ValueGroup>
              </Row>
            )
          })}
        </List>
      </ChartCard>
    </Section>
  )
}

const ChartCard = styled(Card)``

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`

const Row = styled.div`
  display: grid;
  grid-template-columns: 140px 1fr 100px;
  align-items: center;
  gap: var(--space-3);

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 4px;
  }
`

const LabelGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
`

const ItemIcon = styled.span`
  font-size: 0.95rem;
`

const Label = styled.span`
  font-size: 0.85rem;
  color: var(--gray-800);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const BarWrap = styled.div`
  width: 100%;
  height: 28px;
  background: var(--gray-100);
  border-radius: var(--radius-sm);
  overflow: hidden;
`

const Bar = styled.div`
  height: 100%;
  width: ${(props) => props.$width}%;
  background: ${(props) => props.$color || 'var(--sage)'};
  border-radius: var(--radius-sm);
  transition: width 800ms ease;
`

const ValueGroup = styled.div`
  text-align: right;

  @media (max-width: 640px) {
    text-align: left;
  }
`

const Value = styled.div`
  font-family: var(--font-mono);
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--gray-800);
`

const SubValue = styled.div`
  font-size: 0.72rem;
  color: var(--gray-400);
  margin-top: 2px;
`
