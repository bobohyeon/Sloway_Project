import styled from 'styled-components'
import { Card } from '../../../pay_shared/components'

const POLICIES = [
  {
    icon: '🌱',
    title: '결제액 1% 적립',
    description: '이용 완료 후 7일 뒤 자동 적립돼요',
  },
  {
    icon: '📅',
    title: '1년 유효',
    description: '적립일로부터 365일간 사용 가능',
  },
  {
    icon: '💰',
    title: '최소 1,000P부터 사용',
    description: '1P = 1원, 최소 1,000P부터 사용 가능',
  },
  {
    icon: '📊',
    title: '결제액 30%까지 사용',
    description: '한 번에 결제 금액의 30%까지 사용',
  },
]

export function PointPolicyNotice() {
  return (
    <Wrap padded>
      <Header>
        <HeaderIcon>💡</HeaderIcon>
        <HeaderText>포인트 사용 안내</HeaderText>
      </Header>

      <Grid>
        {POLICIES.map((p, i) => (
          <PolicyItem key={i}>
            <PolicyIcon>{p.icon}</PolicyIcon>
            <PolicyBody>
              <PolicyTitle>{p.title}</PolicyTitle>
              <PolicyDesc>{p.description}</PolicyDesc>
            </PolicyBody>
          </PolicyItem>
        ))}
      </Grid>
    </Wrap>
  )
}

const Wrap = styled(Card)`
  background: var(--cream);
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: var(--space-4);
`

const HeaderIcon = styled.span`
  font-size: 1.2rem;
`

const HeaderText = styled.h3`
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--gray-800);
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const PolicyItem = styled.div`
  display: flex;
  gap: var(--space-2);
  padding: var(--space-3);
  background: var(--white);
  border-radius: var(--radius-md);
`

const PolicyIcon = styled.div`
  font-size: 1.3rem;
  flex-shrink: 0;
`

const PolicyBody = styled.div`
  flex: 1;
`

const PolicyTitle = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 2px;
`

const PolicyDesc = styled.div`
  font-size: 0.75rem;
  color: var(--gray-600);
  line-height: 1.4;
`
