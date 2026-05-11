import styled from 'styled-components'

export function HostGreeting({ hostName, todayDate }) {
  const hour = new Date().getHours()
  let greeting = '안녕하세요'
  let emoji = '👋'

  if (hour < 6) {
    greeting = '늦은 시간까지 수고하셨어요'
    emoji = '🌙'
  } else if (hour < 12) {
    greeting = '좋은 아침이에요'
    emoji = '☀️'
  } else if (hour < 18) {
    greeting = '안녕하세요'
    emoji = '👋'
  } else {
    greeting = '오늘도 수고하셨어요'
    emoji = '🌿'
  }

  return (
    <Wrap>
      <Main>
        <Title>
          {greeting}, <strong>{hostName}</strong> 호스트님 {emoji}
        </Title>
        <SubTitle>오늘도 좋은 하루 되세요</SubTitle>
      </Main>
      <DateBadge>{todayDate}</DateBadge>
    </Wrap>
  )
}

const Wrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-5);
  gap: var(--space-3);
`

const Main = styled.div`
  flex: 1;
`

const Title = styled.h1`
  font-family: var(--font-display);
  font-size: 1.7rem;
  font-weight: 400;
  color: var(--gray-800);
  letter-spacing: -0.02em;
  margin-bottom: 4px;

  strong {
    color: var(--sage);
    font-weight: 500;
  }
`

const SubTitle = styled.p`
  font-size: 0.92rem;
  color: var(--gray-600);
`

const DateBadge = styled.div`
  padding: 8px 14px;
  background: var(--cream);
  border-radius: var(--radius-full);
  font-family: var(--font-mono);
  font-size: 0.82rem;
  color: var(--gray-800);
  font-weight: 500;
`
