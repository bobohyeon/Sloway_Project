import styled, { css } from 'styled-components'
import { RefundPolicyBadge } from './RefundPolicyBadge'

export function RefundSummaryCard({
  paidAmount,
  refundAmount,
  rate,
  daysUntilCheckIn,
  policyText,
  canRefund,
}) {
  return (
    <Wrap $canRefund={canRefund}>
      <TopRow>
        <Status $canRefund={canRefund}>{canRefund ? '환불 가능' : '환불 불가'}</Status>
        <DaysLabel>체크인 {daysUntilCheckIn}일 전</DaysLabel>
      </TopRow>

      <Center>
        <Label>환불 예상 금액</Label>
        <Amount>
          <Number>{refundAmount.toLocaleString()}</Number>
          <Unit>원</Unit>
        </Amount>
        <BadgeWrap>
          <RefundPolicyBadge rate={rate} />
        </BadgeWrap>
      </Center>

      <Divider />

      <Detail>
        <DetailRow>
          <span>결제 금액</span>
          <strong>{paidAmount.toLocaleString()}원</strong>
        </DetailRow>
        <DetailRow>
          <span>실제 환불 금액</span>
          <strong>{refundAmount.toLocaleString()}원</strong>
        </DetailRow>
      </Detail>

      <PolicyHint>
        <span>💡</span>
        <span>{policyText}</span>
      </PolicyHint>
    </Wrap>
  )
}

const Wrap = styled.div`
  padding: var(--space-6);
  background: ${(props) => (props.$canRefund ? 'var(--cream)' : 'var(--gray-100)')};
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);

  ${(props) =>
    props.$canRefund &&
    css`
      border-color: var(--sage);
    `}
`

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
`

const Status = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  background: ${(props) => (props.$canRefund ? 'rgba(168, 184, 159, 0.25)' : 'rgba(184, 90, 78, 0.15)')};
  color: ${(props) => (props.$canRefund ? '#5b6b53' : '#a04c42')};
  border-radius: var(--radius-full);
  font-size: 0.78rem;
  font-weight: 600;
`

const DaysLabel = styled.div`
  font-size: 0.85rem;
  color: var(--gray-600);
`

const Center = styled.div`
  text-align: center;
  padding: var(--space-4) 0;
`

const Label = styled.div`
  font-size: 0.85rem;
  color: var(--gray-600);
  margin-bottom: var(--space-2);
`

const Amount = styled.div`
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 4px;
  margin-bottom: var(--space-3);
`

const Number = styled.span`
  font-family: var(--font-display);
  font-size: 2.4rem;
  font-weight: 500;
  color: var(--gray-800);
  letter-spacing: -0.02em;
`

const Unit = styled.span`
  font-size: 1.1rem;
  color: var(--gray-600);
`

const BadgeWrap = styled.div`
  display: flex;
  justify-content: center;
`

const Divider = styled.hr`
  border: none;
  border-top: 1px dashed var(--gray-200);
  margin: var(--space-3) 0;
`

const Detail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: var(--space-3);
`

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.88rem;

  span {
    color: var(--gray-600);
  }

  strong {
    color: var(--gray-800);
    font-weight: 500;
  }
`

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
`
