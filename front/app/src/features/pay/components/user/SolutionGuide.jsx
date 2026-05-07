import styled from 'styled-components'
import { Card } from '../../../pay_shared/components'

const DEFAULT_SOLUTIONS = [
  { num: 1, title: '카드 한도 확인', desc: '신용카드사 앱에서 일일 한도를 확인하고 조정해보세요' },
  { num: 2, title: '다른 결제 수단 시도', desc: '카카오페이 · 네이버페이 · 토스페이 등 간편결제를 이용해보세요' },
  { num: 3, title: '잠시 후 재시도', desc: '네트워크 오류일 경우 10분 후 다시 시도하면 해결될 수 있어요' },
]

export function SolutionGuide({ solutions = DEFAULT_SOLUTIONS, notice }) {
  return (
    <Card padded>
      <Title>이렇게 해보세요</Title>

      <List>
        {solutions.map((s) => (
          <SolutionItem key={s.num}>
            <Num>{s.num}</Num>
            <Body>
              <ItemTitle>{s.title}</ItemTitle>
              <ItemDesc>{s.desc}</ItemDesc>
            </Body>
          </SolutionItem>
        ))}
      </List>

      {notice && (
        <Notice>
          <span>📌</span>
          <span>{notice}</span>
        </Notice>
      )}
    </Card>
  )
}

const Title = styled.h3`
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: var(--space-3);
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`

const SolutionItem = styled.div`
  display: flex;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--gray-100);
  border-radius: var(--radius-md);
  transition: background 160ms ease;

  &:hover {
    background: var(--cream);
  }
`

const Num = styled.div`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  background: var(--sage);
  color: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.78rem;
  font-weight: 600;
`

const Body = styled.div`
  flex: 1;
`

const ItemTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 2px;
`

const ItemDesc = styled.div`
  font-size: 0.78rem;
  color: var(--gray-600);
  line-height: 1.5;
`

const Notice = styled.div`
  margin-top: var(--space-4);
  padding: var(--space-3);
  background: rgba(168, 184, 159, 0.12);
  border-radius: var(--radius-md);
  font-size: 0.82rem;
  color: var(--gray-600);
  display: flex;
  gap: 8px;
  align-items: flex-start;
`
