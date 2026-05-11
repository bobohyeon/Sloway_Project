import styled, { css } from 'styled-components'
import { Card, Section } from '../../../pay_shared/components'

export function RankingList({ title, items, formatValue, action }) {
  return (
    <Section title={title} action={action}>
      <ListCard>
        {items.map((item, i) => (
          <Item key={i}>
            <RankBadge $rank={i + 1}>{i + 1}</RankBadge>

            <ItemBody>
              <NameRow>
                {item.icon && <ItemIcon>{item.icon}</ItemIcon>}
                <ItemName>{item.name}</ItemName>
              </NameRow>
              {item.meta && <Meta>{item.meta}</Meta>}
            </ItemBody>

            <ValueGroup>
              <Value>{formatValue ? formatValue(item.value) : item.value.toLocaleString()}</Value>
              {item.delta && (
                <Delta $type={item.deltaType}>
                  {item.deltaType === 'up' ? '↑' : '↓'} {item.delta}
                </Delta>
              )}
            </ValueGroup>
          </Item>
        ))}
      </ListCard>
    </Section>
  )
}

const ListCard = styled(Card)`
  padding: 0;
  overflow: hidden;
`

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--gray-200);

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: var(--cream);
  }
`

const RankBadge = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 0.82rem;
  font-weight: 600;
  background: var(--gray-100);
  color: var(--gray-600);
  flex-shrink: 0;

  ${(props) =>
    props.$rank === 1 &&
    css`
      background: #d4861f;
      color: var(--white);
    `}

  ${(props) =>
    props.$rank === 2 &&
    css`
      background: #a8b89f;
      color: var(--white);
    `}

  ${(props) =>
    props.$rank === 3 &&
    css`
      background: #c5d1bd;
      color: var(--gray-800);
    `}
`

const ItemBody = styled.div`
  flex: 1;
  min-width: 0;
`

const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

const ItemIcon = styled.span`
  font-size: 0.95rem;
`

const ItemName = styled.div`
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--gray-800);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Meta = styled.div`
  font-size: 0.72rem;
  color: var(--gray-400);
  margin-top: 2px;
`

const ValueGroup = styled.div`
  text-align: right;
  flex-shrink: 0;
`

const Value = styled.div`
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--gray-800);
`

const Delta = styled.div`
  font-size: 0.72rem;
  margin-top: 2px;
  color: ${(props) => (props.$type === 'up' ? 'var(--sage)' : '#b85a4e')};
  font-weight: 600;
`
