import styled from 'styled-components'
import { Card } from '../../../pay_shared/components'

export function ErrorReasonCard({ error }) {
  return (
    <Card padded>
      <TopRow>
        <Label>오류 사유</Label>
        <Reason>{error.reason}</Reason>
      </TopRow>
      <ErrorCode>오류 코드 · {error.code}</ErrorCode>

      <Divider />

      <DetailBox>
        <Icon>ⓘ</Icon>
        <DetailContent>
          <DetailMessage>{error.message}</DetailMessage>
          <DetailTime>시도 시각 · {error.attemptedAt}</DetailTime>
        </DetailContent>
      </DetailBox>
    </Card>
  )
}

const TopRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: var(--space-4);
  margin-bottom: 4px;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 4px;
    align-items: flex-start;
  }
`

const Label = styled.div`
  font-size: 0.85rem;
  color: var(--gray-400);
  flex-shrink: 0;
`

const Reason = styled.div`
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 500;
  color: #b85a4e;
  letter-spacing: -0.01em;
`

const ErrorCode = styled.div`
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--gray-400);
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--gray-200);
  margin: var(--space-4) 0;
`

const DetailBox = styled.div`
  display: flex;
  gap: var(--space-3);
  padding: var(--space-3);
  background: rgba(91, 122, 140, 0.06);
  border-left: 3px solid #5b7a8c;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
`

const Icon = styled.div`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  background: #5b7a8c;
  color: var(--white);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
`

const DetailContent = styled.div`
  flex: 1;
`

const DetailMessage = styled.div`
  font-size: 0.88rem;
  color: var(--gray-800);
  margin-bottom: 4px;
`

const DetailTime = styled.div`
  font-size: 0.78rem;
  color: var(--gray-400);
`
