import styled from 'styled-components'
import { Card, Section, Button, Badge, EmptyState } from '../../../pay_shared/components'

export function RecentSettlementsTable({ items, onSeeAll, onClickItem }) {
  if (!items || items.length === 0) {
    return (
      <Section title="최근 정산 내역">
        <EmptyState
          icon="📋"
          title="아직 정산 내역이 없어요"
          description="공간을 운영하면 매월 5일에 정산이 진행돼요"
        />
      </Section>
    )
  }

  return (
    <Section
      title="최근 정산 내역"
      action={
        <Button variant="ghost" size="sm" onClick={onSeeAll}>
          전체 보기 →
        </Button>
      }
    >
      <TableCard>
        <TableHeader>
          <Col $w="120px">정산일</Col>
          <Col $flex>공간</Col>
          <Col $w="100px" $align="center">건수</Col>
          <Col $w="160px" $align="right">정산 금액</Col>
          <Col $w="100px" $align="center">상태</Col>
        </TableHeader>

        {items.map((item) => (
          <TableRow key={item.id} onClick={() => onClickItem?.(item)}>
            <Col $w="120px">
              <DateText>{item.settlementDate}</DateText>
            </Col>
            <Col $flex>
              <SpaceWrap>
                <SpaceEmoji>{item.spaceEmoji}</SpaceEmoji>
                <SpaceName>{item.spaceName}</SpaceName>
              </SpaceWrap>
            </Col>
            <Col $w="100px" $align="center">
              <Count>{item.bookingCount}건</Count>
            </Col>
            <Col $w="160px" $align="right">
              <Amount>{item.amount.toLocaleString()}원</Amount>
            </Col>
            <Col $w="100px" $align="center">
              <Badge variant={item.status === 'completed' ? 'success' : 'warning'} size="sm">
                {item.status === 'completed' ? '완료' : '예정'}
              </Badge>
            </Col>
          </TableRow>
        ))}
      </TableCard>
    </Section>
  )
}

const TableCard = styled(Card)`
  padding: 0;
  overflow: hidden;
`

const TableHeader = styled.div`
  display: flex;
  align-items: center;
  padding: var(--space-3) var(--space-4);
  background: var(--gray-100);
  border-bottom: 1px solid var(--gray-200);
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--gray-600);
`

const TableRow = styled.div`
  display: flex;
  align-items: center;
  padding: var(--space-4);
  border-bottom: 1px solid var(--gray-200);
  cursor: pointer;
  transition: background 160ms ease;

  &:hover {
    background: var(--cream);
  }

  &:last-child {
    border-bottom: none;
  }
`

const Col = styled.div`
  ${(props) => (props.$w ? `width: ${props.$w};` : '')}
  ${(props) => (props.$flex ? `flex: 1;` : '')}
  ${(props) => (props.$align ? `text-align: ${props.$align};` : '')}
  font-size: 0.85rem;
  min-width: 0;

  @media (max-width: 640px) {
    ${(props) => (props.$w === '100px' ? 'display: none;' : '')}
  }
`

const DateText = styled.div`
  font-family: var(--font-mono);
  font-size: 0.82rem;
  color: var(--gray-800);
`

const SpaceWrap = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
`

const SpaceEmoji = styled.div`
  width: 28px;
  height: 28px;
  background: var(--gray-100);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
`

const SpaceName = styled.div`
  font-size: 0.88rem;
  color: var(--gray-800);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Count = styled.span`
  font-size: 0.85rem;
  color: var(--gray-600);
`

const Amount = styled.strong`
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--gray-800);
`
