import styled, { css } from 'styled-components'
import { Card, Section } from '../../../pay_shared/components'

export function CashReceiptInfo({
  receiptType,
  onReceiptTypeChange,
  idType,
  onIdTypeChange,
  idNumber,
  onIdNumberChange,
}) {
  const idPlaceholder =
    idType === 'phone'
      ? '01012345678 (-, 공백 없이)'
      : '1234567890 (사업자번호 10자리)'

  return (
    <Section title="기본 발급 정보">
      <InfoCard padded>
        <FieldGroup>
          <Label>발급 유형 *</Label>
          <RadioGroup>
            <RadioOption
              $selected={receiptType === 'income'}
              onClick={() => onReceiptTypeChange('income')}
            >
              <RadioDot $checked={receiptType === 'income'} />
              <RadioBody>
                <RadioTitle>소득공제용</RadioTitle>
                <RadioDesc>개인 연말정산용 (휴대전화 번호)</RadioDesc>
              </RadioBody>
            </RadioOption>

            <RadioOption
              $selected={receiptType === 'expense'}
              onClick={() => onReceiptTypeChange('expense')}
            >
              <RadioDot $checked={receiptType === 'expense'} />
              <RadioBody>
                <RadioTitle>지출증빙용</RadioTitle>
                <RadioDesc>사업자 지출 증빙용 (사업자번호)</RadioDesc>
              </RadioBody>
            </RadioOption>
          </RadioGroup>
        </FieldGroup>

        <FieldGroup>
          <Label>신원 확인 번호 *</Label>
          <TypeTabs>
            <TypeTab
              $active={idType === 'phone'}
              onClick={() => onIdTypeChange('phone')}
              disabled={receiptType === 'expense'}
            >
              휴대전화
            </TypeTab>
            <TypeTab
              $active={idType === 'business'}
              onClick={() => onIdTypeChange('business')}
              disabled={receiptType === 'income'}
            >
              사업자번호
            </TypeTab>
          </TypeTabs>

          <Input
            type="text"
            placeholder={idPlaceholder}
            value={idNumber}
            onChange={(e) => onIdNumberChange(e.target.value.replace(/[^0-9]/g, ''))}
            maxLength={11}
          />
          <Hint>
            {idType === 'phone'
              ? '국세청에 등록된 본인 명의 휴대전화 번호를 입력해주세요'
              : '국세청 사업자등록번호 10자리를 입력해주세요'}
          </Hint>
        </FieldGroup>
      </InfoCard>
    </Section>
  )
}

const InfoCard = styled(Card)``

const FieldGroup = styled.div`
  &:not(:last-child) {
    margin-bottom: var(--space-4);
    padding-bottom: var(--space-4);
    border-bottom: 1px dashed var(--gray-200);
  }
`

const Label = styled.div`
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: var(--space-2);
`

const RadioGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2);

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`

const RadioOption = styled.button`
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  padding: var(--space-3);
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  text-align: left;
  cursor: pointer;
  transition: all 160ms ease;

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

const RadioDot = styled.span`
  width: 18px;
  height: 18px;
  border: 2px solid ${(props) => (props.$checked ? 'var(--sage)' : 'var(--gray-200)')};
  border-radius: 50%;
  flex-shrink: 0;
  position: relative;
  margin-top: 2px;

  ${(props) =>
    props.$checked &&
    css`
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--sage);
        transform: translate(-50%, -50%);
      }
    `}
`

const RadioBody = styled.div`
  flex: 1;
`

const RadioTitle = styled.div`
  font-size: 0.92rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 2px;
`

const RadioDesc = styled.div`
  font-size: 0.75rem;
  color: var(--gray-600);
`

const TypeTabs = styled.div`
  display: inline-flex;
  gap: 4px;
  background: var(--gray-100);
  padding: 4px;
  border-radius: var(--radius-full);
  margin-bottom: var(--space-2);
`

const TypeTab = styled.button`
  padding: 6px 14px;
  border-radius: var(--radius-full);
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--gray-600);
  transition: all 160ms ease;
  cursor: pointer;

  &:hover:not(:disabled) {
    color: var(--gray-800);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  ${(props) =>
    props.$active &&
    css`
      background: var(--white);
      color: var(--gray-800);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    `}
`

const Input = styled.input`
  width: 100%;
  padding: 10px 14px;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  font-family: var(--font-mono);
  font-size: 0.92rem;
  outline: none;
  transition: border-color 160ms ease;

  &:focus {
    border-color: var(--sage);
    box-shadow: 0 0 0 3px rgba(168, 184, 159, 0.15);
  }

  &::placeholder {
    color: var(--gray-400);
    font-family: inherit;
  }
`

const Hint = styled.div`
  font-size: 0.75rem;
  color: var(--gray-400);
  margin-top: 4px;
`
