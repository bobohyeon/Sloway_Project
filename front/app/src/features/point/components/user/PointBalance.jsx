import styled from 'styled-components'

export function PointBalance({ balance, pendingPoints }) {
  return (
    <Wrap>
      <BackgroundLeaves>🌿</BackgroundLeaves>

      <Top>
        <Label>
          <Icon>🌱</Icon>
          보유 포인트
        </Label>
        {pendingPoints > 0 && (
          <PendingBadge>
            적립 예정 <strong>{pendingPoints.toLocaleString()}P</strong>
          </PendingBadge>
        )}
      </Top>

      <BalanceRow>
        <BalanceNumber>{balance.toLocaleString()}</BalanceNumber>
        <BalanceUnit>P</BalanceUnit>
      </BalanceRow>

      <Conversion>= {balance.toLocaleString()}원 사용 가능</Conversion>
    </Wrap>
  )
}

const Wrap = styled.div`
  position: relative;
  padding: var(--space-6);
  background: linear-gradient(135deg, var(--sage) 0%, #6b7d62 100%);
  border-radius: var(--radius-lg);
  color: var(--white);
  overflow: hidden;
`

const BackgroundLeaves = styled.div`
  position: absolute;
  right: -10px;
  bottom: -20px;
  font-size: 8rem;
  opacity: 0.12;
  pointer-events: none;
  transform: rotate(-15deg);
`

const Top = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
  flex-wrap: wrap;
  gap: var(--space-2);
`

const Label = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.88rem;
  opacity: 0.9;
`

const Icon = styled.span`
  font-size: 1.05rem;
`

const PendingBadge = styled.div`
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.18);
  border-radius: var(--radius-full);
  font-size: 0.75rem;

  strong {
    font-weight: 700;
    margin-left: 4px;
  }
`

const BalanceRow = styled.div`
  position: relative;
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 6px;
`

const BalanceNumber = styled.strong`
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1;
`

const BalanceUnit = styled.span`
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 500;
  opacity: 0.9;
`

const Conversion = styled.div`
  position: relative;
  font-size: 0.88rem;
  opacity: 0.85;
`
