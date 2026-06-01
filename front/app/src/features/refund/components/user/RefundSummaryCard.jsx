import styled from 'styled-components';

// 환불 정책표 = 백엔드 SSOT (RefundRate enum) 그대로 고지용.
// 프론트는 금액을 계산하지 않는다 — 실제 환불액은 환불 신청 시 백엔드가 예약 일정 기준으로 산정.
const REFUND_POLICY = [
  { label: '7일 이전', rate: '100%' },
  { label: '4~6일 전', rate: '70%' },
  { label: '2~3일 전', rate: '50%' },
  { label: '1일 전', rate: '30%' },
  { label: '당일 · 이용 후', rate: '0%' },
];

export function RefundSummaryCard({ paidAmount }) {
  return (
    <Wrap>
      <Center>
        <Label>결제 금액</Label>
        <Amount>
          <Number>{Number(paidAmount ?? 0).toLocaleString()}</Number>
          <Unit>원</Unit>
        </Amount>
      </Center>

      <Divider />

      <PolicyTitle>환불 정책</PolicyTitle>
      <PolicyTable>
        {REFUND_POLICY.map((p) => (
          <PolicyRow key={p.label}>
            <span>{p.label}</span>
            <strong>{p.rate}</strong>
          </PolicyRow>
        ))}
      </PolicyTable>

      <PolicyHint>
        <span>💡</span>
        <span>
          실제 환불 금액은 예약 일정(체크인 기준)에 따라 환불 신청 시 자동
          계산됩니다.
        </span>
      </PolicyHint>
    </Wrap>
  );
}

const Wrap = styled.div`
  padding: var(--space-6);
  background: var(--cream);
  border: 1px solid var(--sage);
  border-radius: var(--radius-lg);
`;

const Center = styled.div`
  text-align: center;
  padding: var(--space-2) 0 var(--space-4);
`;

const Label = styled.div`
  font-size: 0.85rem;
  color: var(--gray-600);
  margin-bottom: var(--space-2);
`;

const Amount = styled.div`
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 4px;
`;

const Number = styled.span`
  font-family: var(--font-display);
  font-size: 2.4rem;
  font-weight: 500;
  color: var(--gray-800);
  letter-spacing: -0.02em;
`;

const Unit = styled.span`
  font-size: 1.1rem;
  color: var(--gray-600);
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px dashed var(--gray-200);
  margin: var(--space-3) 0 var(--space-4);
`;

const PolicyTitle = styled.div`
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: var(--space-3);
`;

const PolicyTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: var(--space-4);
`;

const PolicyRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.88rem;

  span {
    color: var(--gray-600);
  }
  strong {
    color: var(--gray-800);
    font-weight: 600;
  }
`;

const PolicyHint = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-start;
  padding: var(--space-3);
  background: var(--white);
  border-radius: var(--radius-md);
  font-size: 0.82rem;
  color: var(--gray-600);
  line-height: 1.5;
`;
