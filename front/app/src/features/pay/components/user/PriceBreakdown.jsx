import styled, { css } from 'styled-components'

export function PriceBreakdown({ items, total, earnPoints }) {
  return (
    <Wrap>
      <Title>결제 금액</Title>

      <Items>
        {items.map((item, i) => (
          <Row key={i} $type={item.type}>
            <RowLabel>{item.label}</RowLabel>
            <RowAmount>
              {item.type === 'discount' && '-'}
              {Math.abs(item.amount).toLocaleString()}원
            </RowAmount>
          </Row>
        ))}
      </Items>

      <TotalRow>
        <TotalLabel>최종 결제 금액</TotalLabel>
        <TotalValue>
          <TotalAmount>{total.toLocaleString()}</TotalAmount>
          <TotalUnit>원</TotalUnit>
        </TotalValue>
      </TotalRow>

      {earnPoints && earnPoints > 0 && (
        <EarnBox>
          <span>🌱</span>
          <span>
            이용 완료 후 <EarnAmount>{earnPoints.toLocaleString()}P</EarnAmount> 적립 예정
          </span>
        </EarnBox>
      )}
    </Wrap>
  )
}

const Wrap = styled.div`
  padding: var(--space-5) 0;
`

const Title = styled.h4`
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: var(--space-3);
`

const Items = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: var(--space-4);
`

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.88rem;
`

const RowLabel = styled.span`
  color: var(--gray-600);
`

const RowAmount = styled.strong`
  color: ${(props) => (props.$type === 'discount' ? '#b85a4e' : 'var(--gray-800)')};
  font-weight: 500;

  ${(props) =>
    props.$type === 'discount' &&
    css`
      color: #b85a4e;
    `}
`

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: var(--space-4) 0;
  border-top: 2px solid var(--gray-200);
  border-bottom: 2px solid var(--gray-200);
`

const TotalLabel = styled.span`
  font-size: 0.95rem;
  color: var(--gray-800);
  font-weight: 500;
`

const TotalValue = styled.div`
  display: flex;
  align-items: baseline;
  gap: 3px;
`

const TotalAmount = styled.strong`
  font-family: var(--font-display);
  font-size: 1.85rem;
  font-weight: 500;
  color: var(--gray-800);
  letter-spacing: -0.02em;
`

const TotalUnit = styled.span`
  font-size: 1rem;
  color: var(--gray-600);
`

const EarnBox = styled.div`
  margin-top: var(--space-4);
  padding: var(--space-3) var(--space-4);
  background: var(--cream);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: var(--gray-600);
`

const EarnAmount = styled.strong`
  color: var(--sage);
  font-weight: 600;
`
