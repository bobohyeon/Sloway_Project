import styled from 'styled-components'
import { Card, Checkbox } from '../../../pay_shared/components'

export function RefundAgreement({ agreed, onChange }) {
  return (
    <>
      <AgreementCard>
        <Checkbox
          label={
            <span>
              위 <strong>환불 정책</strong>에 동의하며, 예약을 취소합니다
            </span>
          }
          required
          checked={agreed}
          onChange={onChange}
        />
      </AgreementCard>

      <WarningBox>
        <WarningIcon>⚠️</WarningIcon>
        <WarningContent>
          <WarningTitle>취소 후에는 되돌릴 수 없어요</WarningTitle>
          <WarningText>동일한 공간·일정 재예약 시 가격이 달라질 수 있습니다</WarningText>
        </WarningContent>
      </WarningBox>
    </>
  )
}

const AgreementCard = styled(Card)`
  padding: var(--space-4);
  margin-bottom: var(--space-3);

  strong {
    color: var(--gray-800);
    font-weight: 600;
  }
`

const WarningBox = styled.div`
  display: flex;
  gap: var(--space-3);
  padding: var(--space-4);
  background: rgba(184, 90, 78, 0.06);
  border: 1px solid rgba(184, 90, 78, 0.2);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-5);
`

const WarningIcon = styled.div`
  font-size: 1.3rem;
  flex-shrink: 0;
`

const WarningContent = styled.div`
  flex: 1;
`

const WarningTitle = styled.div`
  font-size: 0.92rem;
  font-weight: 600;
  color: #a04c42;
  margin-bottom: 4px;
`

const WarningText = styled.div`
  font-size: 0.82rem;
  color: var(--gray-600);
  line-height: 1.5;
`
