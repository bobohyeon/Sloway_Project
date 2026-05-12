import styled from 'styled-components'
import { Card, Badge } from '../../../pay_shared/components'

export function SettlementSchedule({ periodStart, periodEnd, settlementDate, daysRemaining }) {
  return (
    <Wrap padded>
      <Header>
        <Title>📅 정산 일정 안내</Title>
        <Badge variant="success" size="md">
          {daysRemaining > 0 ? `D-${daysRemaining}` : 'D-DAY'}
        </Badge>
      </Header>

      <Body>
        <DateBlock>
          <Label>집계 기간</Label>
          <Date>
            {periodStart} ~ {periodEnd}
          </Date>
        </DateBlock>

        <Arrow>→</Arrow>

        <DateBlock>
          <Label>정산 예정일</Label>
          <Date $highlight>{settlementDate}</Date>
        </DateBlock>
      </Body>

      <Notice>
        <span>💡</span>
        <span>최근 4일간 발생한 결제 건들이 일괄 정산되어 등록된 계좌로 입금됩니다</span>
      </Notice>
    </Wrap>
  )
}

const Wrap = styled(Card)`
  background: linear-gradient(135deg, var(--cream) 0%, var(--white) 100%);
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
`

const Title = styled.h3`
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--gray-800);
`

const Body = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-4);

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-3);
  }
`

const DateBlock = styled.div`
  flex: 1;
`

const Label = styled.div`
  font-size: 0.78rem;
  color: var(--gray-600);
  margin-bottom: 4px;
`

const Date = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${(props) => (props.$highlight ? 'var(--sage)' : 'var(--gray-800)')};
`

const Arrow = styled.div`
  color: var(--gray-400);
  font-size: 1.5rem;

  @media (max-width: 640px) {
    text-align: center;
    transform: rotate(90deg);
  }
`

const Notice = styled.div`
  display: flex;
  gap: 8px;
  padding: var(--space-3);
  background: var(--white);
  border-radius: var(--radius-md);
  font-size: 0.82rem;
  color: var(--gray-600);
`
