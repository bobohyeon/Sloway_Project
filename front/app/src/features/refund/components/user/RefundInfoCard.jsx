import styled from 'styled-components'
import { Card, Section, Badge } from '../../../pay_shared/components'

export function RefundInfoCard({ refund }) {
  return (
    <Section title="환불 정보">
      <InfoCard padded>
        <Header>
          <RefundIdLabel>환불 신청 번호</RefundIdLabel>
          <RefundId>{refund.refundId}</RefundId>
        </Header>

        <Divider />

        <Grid>
          <InfoBlock>
            <BlockTitle>신청 정보</BlockTitle>
            <InfoRow>
              <span>신청일시</span>
              <strong>{refund.requestedAt}</strong>
            </InfoRow>
            <InfoRow>
              <span>예약 번호</span>
              <Mono>{refund.bookingId}</Mono>
            </InfoRow>
            <InfoRow>
              <span>예상 입금일</span>
              <Highlight>{refund.expectedDepositAt}</Highlight>
            </InfoRow>
          </InfoBlock>

          <InfoBlock>
            <BlockTitle>환불 정보</BlockTitle>
            <InfoRow>
              <span>환불 금액</span>
              <Amount>{refund.amount.toLocaleString()}원</Amount>
            </InfoRow>
            <InfoRow>
              <span>환불 수단</span>
              <strong>
                <MethodChip>{refund.methodIcon}</MethodChip>
                {refund.method}
              </strong>
            </InfoRow>
            <InfoRow>
              <span>환불율</span>
              <Badge variant="success" size="sm">
                {refund.rate}% 환불
              </Badge>
            </InfoRow>
          </InfoBlock>
        </Grid>
      </InfoCard>
    </Section>
  )
}

const InfoCard = styled(Card)``

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const RefundIdLabel = styled.div`
  font-size: 0.78rem;
  color: var(--gray-400);
`

const RefundId = styled.div`
  font-family: var(--font-mono);
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--gray-800);
`

const Divider = styled.hr`
  border: none;
  border-top: 1px dashed var(--gray-200);
  margin: var(--space-3) 0;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-5);

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }
`

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const BlockTitle = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: var(--space-2);
`

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;

  span {
    color: var(--gray-400);
  }

  strong {
    color: var(--gray-800);
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
`

const Mono = styled.strong`
  font-family: var(--font-mono) !important;
  font-size: 0.78rem !important;
`

const Highlight = styled.strong`
  color: var(--sage) !important;
  font-weight: 600 !important;
`

const Amount = styled.strong`
  font-size: 1rem !important;
  color: var(--sage) !important;
  font-weight: 600 !important;
`

const MethodChip = styled.span`
  width: 20px;
  height: 20px;
  background: var(--gray-100);
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
`
