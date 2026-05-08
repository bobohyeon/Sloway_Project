import styled from 'styled-components'

export function PaymentDetailCard({ payment }) {
  return (
    <Wrap>
      <Title>결제 정보</Title>
      <Grid>
        <InfoRow>
          <span>결제 일시</span>
          <strong>{payment.paidAt}</strong>
        </InfoRow>
        <InfoRow>
          <span>결제 수단</span>
          <strong>
            <MethodChip>{payment.methodIcon}</MethodChip>
            {payment.method}
          </strong>
        </InfoRow>
        <InfoRow>
          <span>PG사</span>
          <strong>{payment.pg}</strong>
        </InfoRow>
        <InfoRow>
          <span>승인 번호</span>
          <Mono>{payment.approvalNo}</Mono>
        </InfoRow>
        {payment.cardInfo && (
          <InfoRow>
            <span>카드 정보</span>
            <strong>{payment.cardInfo}</strong>
          </InfoRow>
        )}
        {payment.installments && (
          <InfoRow>
            <span>할부</span>
            <strong>{payment.installments}</strong>
          </InfoRow>
        )}
      </Grid>
    </Wrap>
  )
}

const Wrap = styled.div`
  padding: var(--space-5) 0;
  border-bottom: 1px dashed var(--gray-200);
`

const Title = styled.h4`
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: var(--space-3);
`

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
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
