import styled from 'styled-components';
import { Card, Button } from '../../../pay_shared/components';
import { PriceRow } from './PriceRow';

export function PaymentSummary({
  pricePerNight,
  nights,
  serviceFee,
  couponDiscount,
  usePoints,
  total,
  earnPoints,
  canPay,
  onPay,
}) {
  return (
    <Card elevated padded>
      <Title>결제 금액</Title>

      <Breakdown>
        <PriceRow
          label={`${pricePerNight.toLocaleString()}원 × ${nights}박`}
          amount={pricePerNight * nights}
        />
        <PriceRow label="서비스 수수료" amount={serviceFee} />

        {couponDiscount > 0 && (
          <PriceRow
            label="🎟️ 쿠폰 할인"
            amount={couponDiscount}
            type="discount"
          />
        )}

        {usePoints > 0 && (
          <PriceRow label="🌱 포인트 사용" amount={usePoints} type="discount" />
        )}
      </Breakdown>

      <TotalRow>
        <span>최종 결제 금액</span>
        <Total>
          <strong>{total.toLocaleString()}</strong>
          <span>원</span>
        </Total>
      </TotalRow>

      <EarnBox>
        <span>🌱</span>
        <span>
          이용 완료 후 <strong>{earnPoints.toLocaleString()}P</strong> 적립 예정
        </span>
      </EarnBox>

      <Button
        variant="primary"
        size="lg"
        full
        disabled={!canPay}
        onClick={onPay}
      >
        {canPay ? `${total.toLocaleString()}원 결제하기` : '약관 동의 필요'}
      </Button>

      <SecureBox>🔒 안전한 결제 · PG 암호화 연동</SecureBox>
    </Card>
  );
}

const Title = styled.h3`
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 500;
  color: var(--gray-800);
  letter-spacing: -0.01em;
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--gray-200);
`;

const Breakdown = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: var(--space-3);
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: var(--space-4) 0;
  border-top: 1px solid var(--gray-200);
  border-bottom: 1px solid var(--gray-200);
  margin-bottom: var(--space-3);

  & > span {
    font-size: 0.9rem;
    color: var(--gray-800);
    font-weight: 500;
  }
`;

const Total = styled.div`
  display: flex;
  align-items: baseline;
  gap: 3px;

  strong {
    font-family: var(--font-display);
    font-size: 1.75rem;
    font-weight: 500;
    color: var(--gray-800);
    letter-spacing: -0.02em;
  }

  span {
    font-size: 0.95rem;
    color: var(--gray-600);
  }
`;

const EarnBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: var(--space-3) var(--space-4);
  background: var(--cream);
  border-radius: var(--radius-md);
  font-size: 0.82rem;
  color: var(--gray-600);
  margin-bottom: var(--space-4);

  strong {
    color: var(--sage);
    font-weight: 600;
  }
`;

const SecureBox = styled.div`
  margin-top: var(--space-3);
  text-align: center;
  font-size: 0.75rem;
  color: var(--gray-400);
`;
