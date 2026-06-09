import styled from 'styled-components';
import { Card, Button } from '../../../pay_shared/components';
import { PaymentStatusBadge } from './PaymentStatusBadge';

export function PaymentListItem({ payment, onClick, onReceiptClick }) {
  const isRefunded = payment.status === 'refunded';

  const handleReceipt = (e) => {
    e.stopPropagation();
    onReceiptClick?.(payment);
  };

  return (
    <Wrap onClick={() => onClick?.(payment)}>
      <Image>{payment.emoji}</Image>

      <Body>
        <TopRow>
          <PaymentStatusBadge status={payment.status} />
          <MethodChip>
            <span>{payment.methodIcon}</span>
            {payment.method}
          </MethodChip>
        </TopRow>

        <SpaceName>{payment.space}</SpaceName>

        <Meta>
          <PaymentId>{payment.id}</PaymentId>
          <Sep>·</Sep>
          <span>{payment.paidAt}</span>
        </Meta>
      </Body>

      <Right>
        <Price $refunded={isRefunded}>
          {isRefunded && <RefundLabel>환불</RefundLabel>}
          <strong>{payment.amount.toLocaleString()}</strong>
          <span>원</span>
        </Price>
        <Button variant="ghost" size="sm" onClick={handleReceipt}>
          영수증
        </Button>
      </Right>
    </Wrap>
  );
}

const Wrap = styled(Card)`
  display: flex;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-5);
  cursor: pointer;
  transition: all 200ms ease;

  &:hover {
    border-color: var(--sage);
    transform: translateY(-1px);
  }
`;

const Image = styled.div`
  width: 64px;
  height: 64px;
  background: var(--gray-100);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  flex-shrink: 0;
`;

const Body = styled.div`
  flex: 1;
  min-width: 0;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
`;

const MethodChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: var(--gray-600);
`;

const SpaceName = styled.div`
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 4px;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  color: var(--gray-400);
`;

const PaymentId = styled.span`
  font-family: var(--font-mono);
`;

const Sep = styled.span`
  opacity: 0.4;
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-2);
  flex-shrink: 0;
`;

const Price = styled.div`
  display: flex;
  align-items: baseline;
  gap: 2px;

  strong {
    font-family: var(--font-display);
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--gray-800);

    ${(props) =>
      props.$refunded &&
      `
      text-decoration: line-through;
      color: var(--gray-400);
    `}
  }

  span {
    font-size: 0.78rem;
    color: var(--gray-600);
  }
`;

const RefundLabel = styled.span`
  font-size: 0.7rem !important;
  color: var(--gray-400) !important;
  margin-right: 4px;
`;
