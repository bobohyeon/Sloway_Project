import styled from 'styled-components'
import { Card } from '../../../pay_shared/components'

const DEFAULT_STEPS = [
  { num: 1, icon: '📧', title: '확인 메일 발송', desc: '예약 내역이 가입 이메일로 발송됩니다' },
  { num: 2, icon: '🔔', title: '체크인 D-1 알림', desc: '체크인 하루 전 상세 안내 알림을 보내드려요' },
  { num: 3, icon: '🌲', title: '즐거운 워케이션!', desc: '공간을 마음껏 즐기시고 리뷰로 경험을 공유해주세요' },
]

export function NextStepsList({ steps = DEFAULT_STEPS }) {
  return (
    <Wrap>
      <Title>다음 단계</Title>
      <Grid>
        {steps.map((step) => (
          <StepCard key={step.num}>
            <StepHeader>
              <StepIcon>{step.icon}</StepIcon>
              <StepNum>{step.num}</StepNum>
            </StepHeader>
            <StepTitle>{step.title}</StepTitle>
            <StepDesc>{step.desc}</StepDesc>
          </StepCard>
        ))}
      </Grid>
    </Wrap>
  )
}

const Wrap = styled.div`
  margin-top: var(--space-6);
`

const Title = styled.h3`
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: var(--space-3);
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const StepCard = styled(Card)`
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const StepHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const StepIcon = styled.div`
  width: 40px;
  height: 40px;
  background: var(--cream);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
`

const StepNum = styled.div`
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--gray-400);
`

const StepTitle = styled.div`
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-top: var(--space-2);
`

const StepDesc = styled.div`
  font-size: 0.78rem;
  color: var(--gray-600);
  line-height: 1.5;
`
