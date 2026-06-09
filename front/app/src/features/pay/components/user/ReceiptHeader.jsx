import styled from 'styled-components';
import { Badge } from '../../../pay_shared/components';

export function ReceiptHeader({ status = 'completed', paymentId }) {
  const statusInfo = {
    completed: { label: '결제 완료', variant: 'success' },
    refunded: { label: '환불됨', variant: 'muted' },
  }[status] || { label: '결제 완료', variant: 'success' };

  return (
    <Wrap>
      <Brand>
        <BrandLogo>
          <LogoImage src="/Sloway_logo.png" alt="Sloway" />
          <LogoText>Sloway</LogoText>
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
  );
}

const Wrap = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding-bottom: var(--space-5);
  border-bottom: 2px dashed var(--gray-200);
  margin-bottom: var(--space-5);
`;

const Brand = styled.div``;

const BrandLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

const LogoImage = styled.img`
  height: 36px;
  width: auto;
  object-fit: contain;
`;

const LogoText = styled.span`
  font-family: 'Malgun Gothic', sans-serif;
  font-size: 24px;
  font-weight: 800;
  background: linear-gradient(135deg, #2d3b2e 0%, #6b8a6e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
`;

const BrandTag = styled.div`
  font-size: 0.78rem;
  color: var(--gray-400);
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
`;

const PaymentId = styled.div`
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--gray-600);
`;
