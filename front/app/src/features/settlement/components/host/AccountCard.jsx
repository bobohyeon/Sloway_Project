import styled from 'styled-components'
import { Card, Badge } from '../../../pay_shared/components'

export function AccountCard({ account }) {
  if (!account) {
    return (
      <EmptyCard>
        <EmptyIcon>🏦</EmptyIcon>
        <EmptyText>등록된 정산 계좌가 없어요</EmptyText>
        <EmptySub>정산 받을 계좌를 등록해주세요</EmptySub>
      </EmptyCard>
    )
  }

  const masked = maskAccountNumber(account.accountNumber)

  return (
    <Wrap padded>
      <BankRow>
        <BankIcon style={{ background: account.bankColor }}>{account.bankInitial}</BankIcon>
        <BankInfo>
          <BankName>{account.bankName}</BankName>
          <AccountNumber>{masked}</AccountNumber>
        </BankInfo>
        <Badge variant={account.verified ? 'success' : 'warning'} size="md">
          {account.verified ? '✓ 인증 완료' : '⏳ 인증 대기'}
        </Badge>
      </BankRow>

      <Divider />

      <DetailGrid>
        <DetailRow>
          <Label>예금주</Label>
          <Value>{account.holderName}</Value>
        </DetailRow>
        <DetailRow>
          <Label>등록일</Label>
          <Value>{account.registeredAt}</Value>
        </DetailRow>
        <DetailRow>
          <Label>인증 방식</Label>
          <Value>1원 송금 인증</Value>
        </DetailRow>
        {account.verifiedAt && (
          <DetailRow>
            <Label>인증 완료일</Label>
            <Value>{account.verifiedAt}</Value>
          </DetailRow>
        )}
      </DetailGrid>
    </Wrap>
  )
}

function maskAccountNumber(num) {
  if (!num) return ''
  const len = num.length
  if (len <= 4) return num
  const visible = 4
  const masked = '*'.repeat(len - visible)
  return num.slice(0, visible) + '-' + masked.slice(0, 4) + '-' + masked.slice(4)
}

const Wrap = styled(Card)`
  background: linear-gradient(135deg, var(--cream) 0%, var(--white) 100%);
`

const BankRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
`

const BankIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--white);
  flex-shrink: 0;
`

const BankInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const BankName = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 2px;
`

const AccountNumber = styled.div`
  font-family: var(--font-mono);
  font-size: 0.88rem;
  color: var(--gray-600);
  letter-spacing: 0.5px;
`

const Divider = styled.hr`
  border: none;
  border-top: 1px dashed var(--gray-200);
  margin: var(--space-3) 0;
`

const DetailGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
`

const Label = styled.span`
  color: var(--gray-400);
`

const Value = styled.span`
  color: var(--gray-800);
  font-weight: 500;
`

const EmptyCard = styled(Card)`
  padding: var(--space-10) var(--space-5);
  text-align: center;
  background: var(--gray-100);
`

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: var(--space-3);
  opacity: 0.6;
`

const EmptyText = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 4px;
`

const EmptySub = styled.div`
  font-size: 0.82rem;
  color: var(--gray-600);
`
