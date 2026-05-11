import styled from 'styled-components'
import { Card } from '../../../pay_shared/components'

export function HostAlertBanner({ alerts, onClickAlert }) {
  if (!alerts || alerts.length === 0) {
    return (
      <EmptyBanner padded>
        <EmptyIcon>🌱</EmptyIcon>
        <EmptyText>
          <EmptyTitle>오늘 처리할 일이 없어요</EmptyTitle>
          <EmptySub>여유로운 하루 보내세요</EmptySub>
        </EmptyText>
      </EmptyBanner>
    )
  }

  const totalCount = alerts.reduce((sum, a) => sum + a.count, 0)

  return (
    <Wrap padded>
      <Header>
        <HeaderIcon>🔔</HeaderIcon>
        <HeaderText>
          <HeaderTitle>오늘 처리할 일 {totalCount}건</HeaderTitle>
          <HeaderSub>아래 항목을 확인해주세요</HeaderSub>
        </HeaderText>
      </Header>

      <AlertList>
        {alerts.map((alert) => (
          <AlertItem key={alert.id} onClick={() => onClickAlert?.(alert)}>
            <AlertIcon>{alert.icon}</AlertIcon>
            <AlertBody>
              <AlertTitle>{alert.title}</AlertTitle>
              <AlertDesc>{alert.description}</AlertDesc>
            </AlertBody>
            <AlertRight>
              <AlertCount>{alert.count}</AlertCount>
              <AlertArrow>→</AlertArrow>
            </AlertRight>
          </AlertItem>
        ))}
      </AlertList>
    </Wrap>
  )
}

const Wrap = styled(Card)`
  background: var(--cream);
  border-color: rgba(168, 184, 159, 0.4);
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
`

const HeaderIcon = styled.div`
  font-size: 1.6rem;
`

const HeaderText = styled.div``

const HeaderTitle = styled.div`
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 2px;
`

const HeaderSub = styled.div`
  font-size: 0.8rem;
  color: var(--gray-600);
`

const AlertList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const AlertItem = styled.button`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
  padding: var(--space-3) var(--space-4);
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  text-align: left;
  cursor: pointer;
  transition: all 160ms ease;

  &:hover {
    border-color: var(--sage);
    transform: translateX(2px);
  }
`

const AlertIcon = styled.span`
  font-size: 1.2rem;
  flex-shrink: 0;
`

const AlertBody = styled.div`
  flex: 1;
  min-width: 0;
`

const AlertTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 2px;
`

const AlertDesc = styled.div`
  font-size: 0.78rem;
  color: var(--gray-600);
`

const AlertRight = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
`

const AlertCount = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 24px;
  padding: 0 8px;
  background: var(--sage);
  color: var(--white);
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 600;
`

const AlertArrow = styled.span`
  color: var(--gray-400);
  font-size: 1.1rem;
`

const EmptyBanner = styled(Card)`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  background: rgba(168, 184, 159, 0.08);
  border-color: rgba(168, 184, 159, 0.3);
`

const EmptyIcon = styled.div`
  width: 40px;
  height: 40px;
  background: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
`

const EmptyText = styled.div`
  flex: 1;
`

const EmptyTitle = styled.div`
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 2px;
`

const EmptySub = styled.div`
  font-size: 0.78rem;
  color: var(--gray-600);
`
