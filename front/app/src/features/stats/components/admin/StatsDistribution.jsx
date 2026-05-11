import styled from 'styled-components'
import { Card, Section } from '../../../pay_shared/components'

export function StatsDistribution({ title, items, action }) {
  const total = items.reduce((s, i) => s + i.count, 0)

  return (
    <Section title={title} action={action}>
      <DistCard padded>
        <SegmentBar>
          {items.map((item, i) => {
            const pct = (item.count / total) * 100
            return (
              <Segment
                key={i}
                $width={pct}
                $color={item.color}
                title={`${item.label}: ${item.count}명 (${pct.toFixed(1)}%)`}
              />
            )
          })}
        </SegmentBar>

        <ItemList>
          {items.map((item, i) => {
            const pct = ((item.count / total) * 100).toFixed(1)
            return (
              <ItemRow key={i}>
                <ItemLeft>
                  <Dot $color={item.color} />
                  <ItemInfo>
                    <ItemLabel>{item.label}</ItemLabel>
                    {item.description && <ItemDesc>{item.description}</ItemDesc>}
                  </ItemInfo>
                </ItemLeft>
                <ItemRight>
                  <Count>{item.count.toLocaleString()}명</Count>
                  <Pct>{pct}%</Pct>
                </ItemRight>
              </ItemRow>
            )
          })}
        </ItemList>
      </DistCard>
    </Section>
  )
}

const DistCard = styled(Card)``

const SegmentBar = styled.div`
  display: flex;
  width: 100%;
  height: 24px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  margin-bottom: var(--space-4);
`

const Segment = styled.div`
  width: ${(props) => props.$width}%;
  background: ${(props) => props.$color || 'var(--sage)'};
  transition: width 800ms ease;
  cursor: pointer;

  &:hover {
    opacity: 0.85;
  }
`

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`

const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
`

const ItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-width: 0;
`

const Dot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 2px;
  background: ${(props) => props.$color};
  flex-shrink: 0;
`

const ItemInfo = styled.div`
  min-width: 0;
`

const ItemLabel = styled.div`
  font-size: 0.85rem;
  color: var(--gray-800);
  font-weight: 500;
`

const ItemDesc = styled.div`
  font-size: 0.72rem;
  color: var(--gray-400);
  margin-top: 1px;
`

const ItemRight = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`

const Count = styled.span`
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--gray-800);
`

const Pct = styled.span`
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--gray-600);
  font-weight: 600;
  min-width: 48px;
  text-align: right;
`
