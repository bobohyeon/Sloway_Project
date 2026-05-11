import styled from 'styled-components'
import { Card } from '../../../pay_shared/components'

export function PointExpiringSoon({ items, totalExpiring }) {
  if (!items || items.length === 0) return null

  return (
    <Wrap padded>
      <Header>
        <HeaderIcon>⚠️</HeaderIcon>
        <HeaderText>
          <HeaderTitle>곧 만료될 포인트 {totalExpiring.toLocaleString()}P</HeaderTitle>
          <HeaderSub>만료 전 사용하세요</HeaderSub>
        </HeaderText>
      </Header>

      <List>
        {items.map((item, i) => (
          <Item key={i}>
            <ItemLeft>
              <Amount>{item.amount.toLocaleString()}P</Amount>
              <Reason>{item.reason}</Reason>
            </ItemLeft>
            <ItemRight>
              <ExpireDate>{item.expireDate}까지</ExpireDate>
              <DDay $urgent={item.daysLeft <= 7}>D-{item.daysLeft}</DDay>
            </ItemRight>
          </Item>
        ))}
      </List>
    </Wrap>
  )
}

const Wrap = styled(Card)`
  background: rgba(212, 134, 31, 0.06);
  border-color: rgba(212, 134, 31, 0.25);
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
`

const HeaderIcon = styled.div`
  font-size: 1.4rem;
`

const HeaderText = styled.div``

const HeaderTitle = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: #b8730f;
  margin-bottom: 2px;
`

const HeaderSub = styled.div`
  font-size: 0.78rem;
  color: var(--gray-600);
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3);
  background: var(--white);
  border-radius: var(--radius-md);
  gap: var(--space-2);

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

const ItemLeft = styled.div`
  flex: 1;
`

const Amount = styled.div`
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--gray-800);
  letter-spacing: -0.02em;
  margin-bottom: 2px;
`

const Reason = styled.div`
  font-size: 0.75rem;
  color: var(--gray-600);
`

const ItemRight = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
`

const ExpireDate = styled.span`
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--gray-600);
`

const DDay = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  background: ${(props) => (props.$urgent ? '#b85a4e' : 'var(--gray-200)')};
  color: ${(props) => (props.$urgent ? 'var(--white)' : 'var(--gray-800)')};
  border-radius: var(--radius-full);
  font-size: 0.72rem;
  font-weight: 600;
`
