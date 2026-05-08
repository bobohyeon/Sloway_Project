import { useState } from 'react'
import styled, { css } from 'styled-components'
import { Modal, Button } from '../../../pay_shared/components'

const BANKS = [
  { code: 'KB', name: '국민은행', color: '#FFB900', initial: 'KB' },
  { code: 'SHINHAN', name: '신한은행', color: '#0046FF', initial: 'SH' },
  { code: 'HANA', name: '하나은행', color: '#00857C', initial: 'HN' },
  { code: 'WOORI', name: '우리은행', color: '#0064C9', initial: 'WR' },
  { code: 'NH', name: 'NH농협', color: '#19A553', initial: 'NH' },
  { code: 'IBK', name: '기업은행', color: '#0049A8', initial: 'IB' },
  { code: 'KAKAO', name: '카카오뱅크', color: '#FEE500', initial: 'KK' },
  { code: 'TOSS', name: '토스뱅크', color: '#0064FF', initial: 'TS' },
]

export function AccountVerifyModal({ open, onClose, onSubmit, isReVerify = false }) {
  const [step, setStep] = useState(1)
  const [bank, setBank] = useState(null)
  const [accountNumber, setAccountNumber] = useState('')
  const [holderName, setHolderName] = useState('')
  const [verifyCode, setVerifyCode] = useState('')

  const handleNext = () => {
    if (step === 1 && bank && accountNumber && holderName) {
      setStep(2)
    } else if (step === 2 && verifyCode.length === 4) {
      onSubmit?.({
        bankName: bank.name,
        bankInitial: bank.initial,
        bankColor: bank.color,
        accountNumber,
        holderName,
        verified: true,
        registeredAt: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
        verifiedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
      })
      reset()
    }
  }

  const reset = () => {
    setStep(1)
    setBank(null)
    setAccountNumber('')
    setHolderName('')
    setVerifyCode('')
  }

  const handleClose = () => {
    reset()
    onClose?.()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isReVerify ? '정산 계좌 변경' : '정산 계좌 등록'}
      maxWidth="520px"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>
            취소
          </Button>
          {step === 2 && (
            <Button variant="secondary" onClick={() => setStep(1)}>
              이전
            </Button>
          )}
          <Button
            variant="primary"
            disabled={
              step === 1
                ? !(bank && accountNumber.length >= 8 && holderName)
                : verifyCode.length !== 4
            }
            onClick={handleNext}
          >
            {step === 1 ? '인증 요청' : '인증 완료'}
          </Button>
        </>
      }
    >
      <Steps>
        <Step $active={step >= 1} $done={step > 1}>
          <StepDot>1</StepDot>
          <StepLabel>계좌 정보 입력</StepLabel>
        </Step>
        <StepLine $done={step > 1} />
        <Step $active={step >= 2}>
          <StepDot>2</StepDot>
          <StepLabel>1원 송금 인증</StepLabel>
        </Step>
      </Steps>

      {step === 1 && (
        <FormWrap>
          <FieldGroup>
            <Label>은행 선택 *</Label>
            <BanksGrid>
              {BANKS.map((b) => (
                <BankOption
                  key={b.code}
                  $selected={bank?.code === b.code}
                  onClick={() => setBank(b)}
                >
                  <BankIcon style={{ background: b.color }}>{b.initial}</BankIcon>
                  <BankName>{b.name}</BankName>
                </BankOption>
              ))}
            </BanksGrid>
          </FieldGroup>

          <FieldGroup>
            <Label>계좌번호 *</Label>
            <Input
              type="text"
              placeholder="'-' 없이 숫자만 입력"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
              maxLength={20}
            />
          </FieldGroup>

          <FieldGroup>
            <Label>예금주 명 *</Label>
            <Input
              type="text"
              placeholder="실명을 입력해주세요"
              value={holderName}
              onChange={(e) => setHolderName(e.target.value)}
            />
            <Hint>예금주 명이 일치하지 않으면 인증이 실패할 수 있어요</Hint>
          </FieldGroup>
        </FormWrap>
      )}

      {step === 2 && (
        <VerifyWrap>
          <VerifyIcon>💸</VerifyIcon>
          <VerifyTitle>{bank?.name}로 1원이 송금됐어요</VerifyTitle>
          <VerifyDesc>
            계좌 입금자명에 표시된 <strong>4자리 숫자</strong>를 입력해주세요
          </VerifyDesc>

          <CodeInputWrap>
            <CodeInput
              type="text"
              placeholder="0000"
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
              maxLength={4}
            />
          </CodeInputWrap>

          <ResendBtn>송금 다시 받기</ResendBtn>

          <NoticeBox>
            <span>💡</span>
            <span>
              입금자명 예시:&nbsp;
              <strong>스로웨이1234</strong> (1234가 인증번호)
            </span>
          </NoticeBox>
        </VerifyWrap>
      )}
    </Modal>
  )
}

const Steps = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  margin-bottom: var(--space-5);
`

const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  opacity: ${(props) => (props.$active ? 1 : 0.4)};
`

const StepDot = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--sage);
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.78rem;
  font-weight: 600;
`

const StepLabel = styled.span`
  font-size: 0.82rem;
  color: var(--gray-800);
  font-weight: 500;
`

const StepLine = styled.div`
  width: 40px;
  height: 2px;
  background: ${(props) => (props.$done ? 'var(--sage)' : 'var(--gray-200)')};
`

const FormWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
`

const FieldGroup = styled.div``

const Label = styled.div`
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 6px;
`

const BanksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-2);
`

const BankOption = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: var(--space-2);
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  transition: all 160ms ease;
  cursor: pointer;

  &:hover {
    border-color: var(--sage);
  }

  ${(props) =>
    props.$selected &&
    css`
      border-color: var(--sage);
      background: var(--cream);
    `}
`

const BankIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.78rem;
  font-weight: 700;
`

const BankName = styled.span`
  font-size: 0.72rem;
  color: var(--gray-800);
`

const Input = styled.input`
  width: 100%;
  padding: 10px 14px;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  font-size: 0.92rem;
  outline: none;
  font-family: inherit;
  transition: border-color 160ms ease;

  &:focus {
    border-color: var(--sage);
    box-shadow: 0 0 0 3px rgba(168, 184, 159, 0.15);
  }
`

const Hint = styled.div`
  font-size: 0.75rem;
  color: var(--gray-400);
  margin-top: 4px;
`

const VerifyWrap = styled.div`
  text-align: center;
  padding: var(--space-3) 0;
`

const VerifyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: var(--space-3);
`

const VerifyTitle = styled.div`
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: var(--space-2);
`

const VerifyDesc = styled.div`
  font-size: 0.88rem;
  color: var(--gray-600);
  margin-bottom: var(--space-4);

  strong {
    color: var(--sage);
    font-weight: 600;
  }
`

const CodeInputWrap = styled.div`
  margin-bottom: var(--space-3);
`

const CodeInput = styled.input`
  width: 200px;
  padding: var(--space-3);
  background: var(--white);
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-md);
  font-family: var(--font-mono);
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  letter-spacing: 8px;
  outline: none;
  transition: border-color 160ms ease;

  &:focus {
    border-color: var(--sage);
  }
`

const ResendBtn = styled.button`
  font-size: 0.82rem;
  color: var(--sage);
  text-decoration: underline;
  margin-bottom: var(--space-4);

  &:hover {
    color: var(--gray-800);
  }
`

const NoticeBox = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  padding: var(--space-3);
  background: var(--cream);
  border-radius: var(--radius-md);
  font-size: 0.8rem;
  color: var(--gray-600);

  strong {
    color: var(--gray-800);
    font-weight: 600;
  }
`
