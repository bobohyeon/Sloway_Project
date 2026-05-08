import styled from 'styled-components'
import { Card, Section, Badge } from '../../../pay_shared/components'

export function SettlementBookingsList({ bookings, totalSales, feeRate, feeAmount }) {
  return (
    <Section title="정산 포함 예약">
      <TableCard>
        <Header>
          <Col $w="120px">예약번호</Col>
          <Col $flex>고객</Col>
          <Col $w="180px" $align="center">이용일</Col>
          <Col $w="140px" $align="right">금액</Col>
        </Header>

        {bookings.map((b) => (
          <Row key={b.id}>
            <Col $w="120px">
              <BookingId>{b.bookingId}</BookingId>
            </Col>
            <Col $flex>
              <CustomerWrap>
                <CustomerName>{b.customerName}</CustomerName>
                <CustomerType>
                  {b.guests}명 · {b.nights}박
                </CustomerType>
              </CustomerWrap>
            </Col>
            <Col $w="180px" $align="center">
              <DateText>{b.checkInDate}</DateText>
            </Col>
            <Col $w="140px" $align="right">
              <Amount>{b.amount.toLocaleString()}원</Amount>
            </Col>
          </Row>
        ))}
      </TableCard>

      <SummaryCard padded>
        <SummaryRow>
          <SummaryLabel>총 매출 (예약 {bookings.length}건)</SummaryLabel>
          <SummaryAmount>{totalSales.toLocaleString()}원</SummaryAmount>
        </SummaryRow>
        <SummaryRow>
          <SummaryLabel>플랫폼 수수료 ({feeRate}%)</SummaryLabel>
          <SummaryAmount $negative>-{feeAmount.toLocaleString()}원</SummaryAmount>
        </SummaryRow>
        <Divider />
        <SummaryRow>
          <FinalLabel>호스트 입금액</FinalLabel>
          <FinalAmount>
            {(totalSales - feeAmount).toLocaleString()}
            <FinalUnit>원</FinalUnit>
          </FinalAmount>
        </SummaryRow>
      </SummaryCard>
    </Section>
  )
}

const TableCard = styled(Card)`
  padding: 0;
  overflow: hidden;
  margin-bottom: var(--space-3);
`

const Header = styled.div`
  display: flex;
  align-items: center;
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
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--gray-200);
  font-size: 0.85rem;

  &:last-child {
    border-bottom: none;
  }
`

const Col = styled.div`
  ${(props) => (props.$w ? `width: ${props.$w};` : '')}
  ${(props) => (props.$flex ? `flex: 1;` : '')}
  ${(props) => (props.$align ? `text-align: ${props.$align};` : '')}
  min-width: 0;

  @media (max-width: 640px) {
    ${(props) => (props.$w === '180px' ? 'display: none;' : '')}
  }
`

const BookingId = styled.div`
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--gray-600);
`

const CustomerWrap = styled.div``

const CustomerName = styled.div`
  font-size: 0.88rem;
  color: var(--gray-800);
  font-weight: 500;
  margin-bottom: 2px;
`

const CustomerType = styled.div`
  font-size: 0.72rem;
  color: var(--gray-400);
`

const DateText = styled.div`
  font-family: var(--font-mono);
  font-size: 0.82rem;
  color: var(--gray-600);
`

const Amount = styled.strong`
  font-size: 0.92rem;
  color: var(--gray-800);
  font-weight: 500;
`

const SummaryCard = styled(Card)`
  background: var(--cream);
`

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
`

const SummaryLabel = styled.span`
  font-size: 0.88rem;
  color: var(--gray-600);
`

const SummaryAmount = styled.strong`
  font-size: 0.92rem;
  font-weight: 500;
  color: ${(props) => (props.$negative ? '#b85a4e' : 'var(--gray-800)')};
`

const Divider = styled.hr`
  border: none;
  border-top: 2px solid var(--gray-200);
  margin: var(--space-2) 0;
`

const FinalLabel = styled.span`
  font-size: 0.95rem;
  color: var(--gray-800);
  font-weight: 600;
`

const FinalAmount = styled.div`
  display: flex;
  align-items: baseline;
  gap: 2px;
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--sage);
  letter-spacing: -0.02em;
`

const FinalUnit = styled.span`
  font-size: 0.85rem;
  color: var(--gray-600);
  font-weight: 400;
`
