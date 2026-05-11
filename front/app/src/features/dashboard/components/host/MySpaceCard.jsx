import styled, { css } from 'styled-components'
import { Card, Badge } from '../../../pay_shared/components'

const STATUS_MAP = {
  active: { label: '활성', variant: 'success' },
  paused: { label: '일시중지', variant: 'warning' },
  inactive: { label: '비활성', variant: 'muted' },
}

export function MySpaceCard({ space, onClick }) {
  const status = STATUS_MAP[space.status] || STATUS_MAP.active

  return (
    <Wrap onClick={() => onClick?.(space)}>
      <SpaceHeader>
        <SpaceEmoji>{space.emoji}</SpaceEmoji>
        <SpaceInfo>
          <SpaceName>{space.name}</SpaceName>
          <SpaceMeta>
            <Badge variant="sage" size="sm">{space.category}</Badge>
            <span>{space.location}</span>
          </SpaceMeta>
        </SpaceInfo>
        <Badge variant={status.variant} size="md">
          {status.label}
        </Badge>
      </SpaceHeader>

      <StatsRow>
        <Stat>
          <StatLabel>점유율</StatLabel>
          <StatValue>
            <Number>{space.occupancyRate}</Number>
            <Unit>%</Unit>
          </StatValue>
          <ProgressBar>
            <ProgressFill $rate={space.occupancyRate} />
          </ProgressBar>
        </Stat>

        <Stat>
          <StatLabel>평점</StatLabel>
          <StatValue>
            <Star>★</Star>
            <Number>{space.rating}</Number>
            <Sub>/ 5.0</Sub>
          </StatValue>
          <ReviewCount>리뷰 {space.reviewCount}개</ReviewCount>
        </Stat>

        <Stat>
          <StatLabel>이번 달 매출</StatLabel>
          <StatValue>
            <Number>{(space.monthRevenue / 10000).toFixed(0)}</Number>
            <Sub>만원</Sub>
          </StatValue>
          <ReviewCount>예약 {space.monthBookings}건</ReviewCount>
        </Stat>
      </StatsRow>

      {space.nextBooking && (
        <NextBooking>
          <NextIcon>📅</NextIcon>
          <NextText>
            다음 예약: <strong>{space.nextBooking}</strong>
          </NextText>
        </NextBooking>
      )}
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

const SpaceHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
`

const SpaceEmoji = styled.div`
  width: 48px;
  height: 48px;
  background: var(--gray-100);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  flex-shrink: 0;
`

const SpaceInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const SpaceName = styled.div`
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 4px;
  letter-spacing: -0.01em;
`

const SpaceMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.78rem;
  color: var(--gray-600);
`

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
  padding: var(--space-3) 0;
  border-top: 1px dashed var(--gray-200);
  border-bottom: 1px dashed var(--gray-200);

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: var(--space-2);
  }
`

const Stat = styled.div``

const StatLabel = styled.div`
  font-size: 0.72rem;
  color: var(--gray-400);
  margin-bottom: 4px;
`

const StatValue = styled.div`
  display: flex;
  align-items: baseline;
  gap: 2px;
  margin-bottom: 4px;
`

const Number = styled.strong`
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--gray-800);
  letter-spacing: -0.02em;
`

const Unit = styled.span`
  font-size: 0.85rem;
  color: var(--gray-600);
`

const Sub = styled.span`
  font-size: 0.78rem;
  color: var(--gray-600);
`

const Star = styled.span`
  color: #d4861f;
  font-size: 1rem;
`

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: var(--gray-100);
  border-radius: var(--radius-full);
  overflow: hidden;
`

const ProgressFill = styled.div`
  height: 100%;
  width: ${(props) => props.$rate}%;
  background: var(--sage);
  border-radius: var(--radius-full);
  transition: width 600ms ease;
`

const ReviewCount = styled.div`
  font-size: 0.72rem;
  color: var(--gray-400);
`

const NextBooking = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: var(--space-3);
  padding: 8px var(--space-3);
  background: var(--cream);
  border-radius: var(--radius-md);
  font-size: 0.82rem;
  color: var(--gray-600);
`

const NextIcon = styled.span`
  font-size: 0.9rem;
`

const NextText = styled.span`
  strong {
    color: var(--gray-800);
    font-weight: 500;
  }
`
