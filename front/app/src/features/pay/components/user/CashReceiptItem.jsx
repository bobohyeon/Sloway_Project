import styled from 'styled-components'
import { Card, Badge, Button } from '../../../pay_shared/components'

const STATUS_MAP = {
  issued: { label: '발행 완료', variant: 'success', icon: '✓' },
  pending: { label: '신청 중', variant: 'warning', icon: '⏳' },
  cancelled: { label: '취소됨', variant: 'muted', icon: '✗' },
  failed: { label: '발급 실패', variant: 'danger', icon: '⚠️' },
}

export function CashReceiptItem({ receipt, onDownload, onCancel }) {
  const status = STATUS_MAP[receipt.status] || STATUS_MAP.issued

  return (
    <Wrap>
      <TopRow>
        <StatusGroup>
          <Badge variant={status.variant} size="md">
            {status.icon} {status.label}
          </Badge>
          <ReceiptId>{receipt.receiptId}</ReceiptId>
        </StatusGroup>
        <DateText>{receipt.issuedAt}</DateText>
      </TopRow>

      <SpaceRow>
        <SpaceEmoji>{receipt.spaceEmoji}</SpaceEmoji>
        <SpaceInfo>
          <SpaceName>{receipt.spaceName}</SpaceName>
          <Meta>
            <span>{receipt.type === 'income' ? '소득공제' : '지출증빙'}</span>
            <Sep>·</Sep>
            <Mono>{receipt.maskedId}</Mono>
          </Meta>
        </SpaceInfo>
      </SpaceRow>

      <Divider />

      <BottomRow>
        <AmountSection>
          <Label>발급 금액</Label>
          <Amount>{receipt.amount.toLocaleString()}원</Amount>
        </AmountSection>

        <Actions>
          {receipt.status === 'issued' && (
            <Button variant="secondary" size="sm" onClick={() => onDownload?.(receipt)}>
              📄 다운로드
            </Button>
          )}
          {receipt.status === 'pending' && (
            <Button variant="ghost" size="sm" onClick={() => onCancel?.(receipt)}>
              신청 취소
            </Button>
          )}
        </Actions>
      </BottomRow>
    </Wrap>
  )
}

const Wrap = styled(Card)`
  padding: var(--space-4) var(--space-5);
  transition: all 200ms ease;

  &:hover {
    border-color: var(--sage);
  }
`

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
`

const StatusGroup = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
`

const ReceiptId = styled.span`
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--gray-600);
`

const DateText = styled.div`
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--gray-400);
`

const SpaceRow = styled.div`
  display: flex;
  gap: var(--space-3);
  align-items: center;
`

const SpaceEmoji = styled.div`
  width: 40px;
  height: 40px;
  background: var(--gray-100);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  flex-shrink: 0;
`

const SpaceInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const SpaceName = styled.div`
  font-size: 0.92rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 4px;
`

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  color: var(--gray-600);
`

const Mono = styled.span`
  font-family: var(--font-mono);
`

const Sep = styled.span`
  opacity: 0.4;
`

const Divider = styled.hr`
  border: none;
  border-top: 1px dashed var(--gray-200);
  margin: var(--space-3) 0;
`

const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
`

const AmountSection = styled.div``

const Label = styled.div`
  font-size: 0.72rem;
  color: var(--gray-400);
  margin-bottom: 2px;
`

const Amount = styled.div`
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--gray-800);
  letter-spacing: -0.02em;
`

const Actions = styled.div`
  display: flex;
  gap: var(--space-2);
`
