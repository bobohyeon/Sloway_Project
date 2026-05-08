import styled from 'styled-components'
import { Badge } from '../../../pay_shared/components'

export function ReceiptHeader({ status = 'completed', paymentId }) {
  const statusInfo = {
    completed: { label: '결제 완료', variant: 'success' },
    refunded: { label: '환불됨', variant: 'muted' },
    failed: { label: '결제 실패', variant: 'danger' },
  }[status] || { label: '결제 완료', variant: 'success' }

  return (
    <Wrap>
      <Brand>
        <BrandLogo>
          <em>Slo</em>way
        </BrandLogo>
        <BrandTag>워케이션 예약 플랫폼</BrandTag>
      </Brand>
      <Right>
        <Badge variant={statusInfo.variant} size="md">
          ✓ {statusInfo.label}
        </Badge>
        {paymentId && <PaymentId>{paymentId}</PaymentId>}
      </Right>
    </Wrap>
  )
}

const Wrap = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding-bottom: var(--space-5);
  border-bottom: 2px dashed var(--gray-200);
  margin-bottom: var(--space-5);
`

const Brand = styled.div``

const BrandLogo = styled.div`
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--gray-800);
  letter-spacing: -0.02em;
  margin-bottom: 4px;

  em {
    color: var(--sage);
    font-style: italic;
  }
`

const BrandTag = styled.div`
  font-size: 0.78rem;
  color: var(--gray-400);
`

const Right = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
`

const PaymentId = styled.div`
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--gray-600);
`
