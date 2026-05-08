import styled from 'styled-components'
import { Card, Badge } from '../../../pay_shared/components'

const STATUS_MAP = {
  completed: { label: '완료', variant: 'success', icon: '✓' },
  scheduled: { label: '예정', variant: 'warning', icon: '⏳' },
  pending: { label: '보류', variant: 'muted', icon: '⏸' },
}

export function SettlementCard({ settlement, onClick, onDownload }) {
  const status = STATUS_MAP[settlement.status] || STATUS_MAP.completed

  const handleDownload = (e) => {
    e.stopPropagation()
    onDownload?.(settlement)
  }

  return (
    <Wrap onClick={() => onClick?.(settlement)}>
      <TopRow>
        <StatusGroup>
          <Badge variant={status.variant} size="md">
            {status.icon} {status.label}
          </Badge>
          <DateText>
            {settlement.settlementDate} 정산
            {settlement.status === 'scheduled' && ' 예정'}
          </DateText>
        </StatusGroup>

        {settlement.status === 'completed' && (
          <DownloadBtn onClick={handleDownload}>📄 정산서</DownloadBtn>
        )}
      </TopRow>

      <SpaceRow>
        <SpaceEmoji>{settlement.spaceEmoji}</SpaceEmoji>
        <SpaceBody>
          <SpaceName>{settlement.spaceName}</SpaceName>
          <SpaceMeta>
            <span>{settlement.bookingCount}건 예약</span>
            <Sep>·</Sep>
            <span>매출 {settlement.salesAmount.toLocaleString()}원</span>
          </SpaceMeta>
        </SpaceBody>
      </SpaceRow>

      <Divider />

      <BottomRow>
        <FeeInfo>
          <FeeRow>
            <FeeLabel>플랫폼 수수료 ({settlement.feeRate}%)</FeeLabel>
            <FeeAmount>-{settlement.feeAmount.toLocaleString()}원</FeeAmount>
          </FeeRow>
        </FeeInfo>

        <PayoutSection>
          <PayoutLabel>호스트 입금액</PayoutLabel>
          <PayoutAmount $highlight={settlement.status === 'completed'}>
            {settlement.payoutAmount.toLocaleString()}
            <Unit>원</Unit>
          </PayoutAmount>
        </PayoutSection>
      </BottomRow>
    </Wrap>
  )
}

const Wrap = styled(Card)`
  padding: var(--space-5);
  cursor: pointer;
  transition: all 200ms ease;

  &:hover {
    border-color: var(--sage);
    transform: translateY(-1px);
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

const DateText = styled.div`
  font-family: var(--font-mono);
  font-size: 0.82rem;
  color: var(--gray-600);
`

const DownloadBtn = styled.button`
  padding: 6px 12px;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  font-size: 0.78rem;
  color: var(--gray-800);
  transition: all 160ms ease;

  &:hover {
    border-color: var(--sage);
    background: var(--cream);
  }
`

const SpaceRow = styled.div`
  display: flex;
  gap: var(--space-3);
  align-items: center;
  margin-bottom: var(--space-3);
`

const SpaceEmoji = styled.div`
  width: 44px;
  height: 44px;
  background: var(--gray-100);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
`

const SpaceBody = styled.div`
  flex: 1;
  min-width: 0;
`

const SpaceName = styled.div`
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 2px;
`

const SpaceMeta = styled.div`
  display: flex;
  gap: 6px;
  font-size: 0.78rem;
  color: var(--gray-600);
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

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`

const FeeInfo = styled.div`
  flex: 1;
`

const FeeRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.82rem;
`

const FeeLabel = styled.span`
  color: var(--gray-400);
`

const FeeAmount = styled.span`
  color: #b85a4e;
  font-weight: 500;
`

const PayoutSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;

  @media (max-width: 480px) {
    align-items: flex-start;
    padding-top: var(--space-2);
    border-top: 1px solid var(--gray-200);
  }
`

const PayoutLabel = styled.span`
  font-size: 0.75rem;
  color: var(--gray-600);
`

const PayoutAmount = styled.div`
  display: flex;
  align-items: baseline;
  gap: 3px;
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 600;
  color: ${(props) => (props.$highlight ? 'var(--sage)' : 'var(--gray-800)')};
  letter-spacing: -0.02em;
`

const Unit = styled.span`
  font-size: 0.85rem;
  color: var(--gray-600);
  font-weight: 400;
`
