import styled from 'styled-components'
import { Card, Section } from '../../../pay_shared/components'

export function CommissionPolicyTable({ policies }) {
  return (
    <Section title="현재 적용 중인 수수료 정책">
      <TableCard>
        <Header>
          <Col $w="40%">카테고리</Col>
          <Col $w="30%" $align="center">수수료율</Col>
          <Col $w="30%" $align="right">적용 시작일</Col>
        </Header>

        {policies.map((p) => (
          <Row key={p.id}>
            <Col $w="40%">
              <CategoryWrap>
                <CategoryIcon>{p.icon}</CategoryIcon>
                <div>
                  <CategoryName>{p.category}</CategoryName>
                  <CategoryDesc>{p.description}</CategoryDesc>
                </div>
              </CategoryWrap>
            </Col>
            <Col $w="30%" $align="center">
              <RateBox>{p.rate}%</RateBox>
            </Col>
            <Col $w="30%" $align="right">
              <DateText>{p.effectiveFrom}</DateText>
            </Col>
          </Row>
        ))}
      </TableCard>
    </Section>
  )
}

const TableCard = styled(Card)`
  padding: 0;
  overflow: hidden;
`

const Header = styled.div`
  display: flex;
  padding: var(--space-3) var(--space-4);
  background: var(--gray-100);
  border-bottom: 1px solid var(--gray-200);
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--gray-600);
`

const Row = styled.div`
  display: flex;
  align-items: center;
  padding: var(--space-4);
  border-bottom: 1px solid var(--gray-200);

  &:last-child {
    border-bottom: none;
  }
`

const Col = styled.div`
  ${(props) => (props.$w ? `width: ${props.$w};` : '')}
  ${(props) => (props.$align ? `text-align: ${props.$align};` : '')}
  font-size: 0.88rem;
`

const CategoryWrap = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
`

const CategoryIcon = styled.div`
  width: 36px;
  height: 36px;
  background: var(--cream);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
`

const CategoryName = styled.div`
  font-size: 0.92rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 2px;
`

const CategoryDesc = styled.div`
  font-size: 0.72rem;
  color: var(--gray-400);
`

const RateBox = styled.span`
  display: inline-block;
  padding: 4px 14px;
  background: var(--sage);
  color: var(--white);
  border-radius: var(--radius-full);
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.02em;
`

const DateText = styled.span`
  font-family: var(--font-mono);
  font-size: 0.82rem;
  color: var(--gray-600);
`
