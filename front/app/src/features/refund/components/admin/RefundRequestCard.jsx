import styled from 'styled-components'
import { Card, Badge } from '../../../pay_shared/components'

const STATUS_MAP = {
  completed: { label: '완료', variant: 'success', icon: '✓' },
  processing: { label: '처리중', variant: 'warning', icon: '⏳' },
  rejected: { label: '거절', variant: 'danger', icon: '✗' },
}

export function RefundRequestCard({ request, onClick }) {
  const status = STATUS_MAP[request.status] || STATUS_MAP.completed

  return (
    <Wrap onClick={() => onClick?.(request)}>
      <TopRow>
        <StatusGroup>
          <Badge variant={status.variant} size="md">
            {status.icon} {status.label}
          </Badge>
          <RefundId>{request.refundId}</RefundId>
        </StatusGroup>

        <DateText>{request.requestedAt}</DateText>
      </TopRow>

      <ContentRow>
        <UserSection>
          <UserLabel>사용자</UserLabel>
          <UserName>
            {request.userName}
            {request.isHostRejected && <RejectedTag>호스트 거절</RejectedTag>}
          </UserName>
        </UserSection>

        <SpaceSection>
          <SpaceLabel>예약 공간</SpaceLabel>
          <SpaceWrap>
            <SpaceEmoji>
              {request.thumbnail ? (
                <img src={request.thumbnail} alt={request.spaceName} />
              ) : (
                request.spaceEmoji
              )}
            </SpaceEmoji>
            <SpaceName>{request.spaceName}</SpaceName>
          </SpaceWrap>
        </SpaceSection>

        <AmountSection>
          <AmountLabel>환불액 ({request.rate}%)</AmountLabel>
          <Amount $highlight={request.status === 'completed'}>
            {request.refundAmount.toLocaleString()}원
          </Amount>
          <SubAmount>결제액 {request.paidAmount.toLocaleString()}원</SubAmount>
        </AmountSection>
      </ContentRow>

      <Footer>
        <FooterLeft>
          <FooterIcon>💬</FooterIcon>
          <span>{request.method}</span>
        </FooterLeft>
        {request.completedAt && (
          <FooterRight>완료: {request.completedAt}</FooterRight>
        )}
      </Footer>
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

const RefundId = styled.span`
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--gray-600);
`

const DateText = styled.div`
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--gray-400);
`

const ContentRow = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1.5fr 1.3fr;
  gap: var(--space-4);
  padding-bottom: var(--space-3);
  border-bottom: 1px dashed var(--gray-200);
  margin-bottom: var(--space-3);

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    gap: var(--space-2);
  }
`

const UserSection = styled.div``

const UserLabel = styled.div`
  font-size: 0.72rem;
  color: var(--gray-400);
  margin-bottom: 4px;
`

const UserName = styled.div`
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--gray-800);
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`

const RejectedTag = styled.span`
  display: inline-block;
  padding: 2px 8px;
  background: rgba(212, 134, 31, 0.15);
  color: #b8730f;
  border-radius: var(--radius-full);
  font-size: 0.7rem;
  font-weight: 500;
`

const SpaceSection = styled.div``

const SpaceLabel = styled.div`
  font-size: 0.72rem;
  color: var(--gray-400);
  margin-bottom: 4px;
`

const SpaceWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

const SpaceEmoji = styled.span`
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border-radius: var(--radius-sm);
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const SpaceName = styled.span`
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--gray-800);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const AmountSection = styled.div`
  text-align: right;

  @media (max-width: 720px) {
    text-align: left;
  }
`

const AmountLabel = styled.div`
  font-size: 0.72rem;
  color: var(--gray-400);
  margin-bottom: 4px;
`

const Amount = styled.div`
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 600;
  color: ${(props) => (props.$highlight ? 'var(--sage)' : 'var(--gray-800)')};
  letter-spacing: -0.02em;
`

const SubAmount = styled.div`
  font-size: 0.72rem;
  color: var(--gray-400);
  margin-top: 2px;
`

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.78rem;
  color: var(--gray-600);
`

const FooterLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

const FooterIcon = styled.span`
  font-size: 0.9rem;
`

const FooterRight = styled.div`
  font-family: var(--font-mono);
  color: var(--gray-400);
`
