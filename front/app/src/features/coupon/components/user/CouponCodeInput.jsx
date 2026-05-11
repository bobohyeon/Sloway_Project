import { useState } from 'react'
import styled from 'styled-components'
import { Card, Button } from '../../../pay_shared/components'

export function CouponCodeInput({ onSubmit }) {
  const [code, setCode] = useState('')

  const handleSubmit = () => {
    if (code.trim().length < 4) {
      alert('쿠폰 코드를 정확히 입력해주세요')
      return
    }
    onSubmit?.(code.trim().toUpperCase())
    setCode('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <Wrap padded>
      <Header>
        <Icon>🎟️</Icon>
        <HeaderText>
          <Title>쿠폰 코드가 있으신가요?</Title>
          <SubTitle>코드를 입력하면 쿠폰함에 자동 추가돼요</SubTitle>
        </HeaderText>
      </Header>

      <InputRow>
        <CodeInput
          type="text"
          placeholder="예: WELCOME2026"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ''))}
          onKeyDown={handleKeyDown}
          maxLength={20}
        />
        <Button variant="primary" onClick={handleSubmit} disabled={!code.trim()}>
          등록
        </Button>
      </InputRow>
    </Wrap>
  )
}

const Wrap = styled(Card)`
  background: linear-gradient(135deg, var(--cream) 0%, var(--white) 100%);
`

const Header = styled.div`
  display: flex;
  gap: var(--space-3);
  align-items: center;
  margin-bottom: var(--space-3);
`

const Icon = styled.div`
  font-size: 1.8rem;
`

const HeaderText = styled.div`
  flex: 1;
`

const Title = styled.div`
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 2px;
`

const SubTitle = styled.div`
  font-size: 0.78rem;
  color: var(--gray-600);
`

const InputRow = styled.div`
  display: flex;
  gap: var(--space-2);
`

const CodeInput = styled.input`
  flex: 1;
  padding: 10px 14px;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  font-family: var(--font-mono);
  font-size: 0.92rem;
  outline: none;
  letter-spacing: 1px;
  transition: border-color 160ms ease;

  &:focus {
    border-color: var(--sage);
    box-shadow: 0 0 0 3px rgba(168, 184, 159, 0.15);
  }

  &::placeholder {
    color: var(--gray-400);
    letter-spacing: 0;
  }
`
