import styled from 'styled-components'

export function AddMethodCard({ onClick }) {
  return (
    <Wrap onClick={onClick}>
      <Plus>+</Plus>
      <Text>새 결제 수단 등록하기</Text>
      <SubText>카드, 카카오페이, 네이버페이, 토스페이</SubText>
    </Wrap>
  )
}

const Wrap = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: var(--space-8) var(--space-5);
  background: transparent;
  border: 2px dashed var(--gray-200);
  border-radius: var(--radius-lg);
  color: var(--gray-600);
  transition: all 200ms ease;

  &:hover {
    border-color: var(--sage);
    background: var(--cream);
    color: var(--gray-800);
  }
`

const Plus = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--gray-100);
  color: var(--gray-600);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: var(--space-2);
  transition: all 200ms ease;

  ${Wrap}:hover & {
    background: var(--sage);
    color: var(--white);
  }
`

const Text = styled.div`
  font-size: 0.95rem;
  font-weight: 500;
`

const SubText = styled.div`
  font-size: 0.78rem;
  color: var(--gray-400);
`
