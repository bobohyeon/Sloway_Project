import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { Button, Card } from '../../../pay_shared/components'
import { AccountCard } from '../../components/host/AccountCard'
import { AccountVerifyModal } from '../../components/host/AccountVerifyModal'

const INITIAL_ACCOUNT = {
  bankName: '국민은행',
  bankInitial: 'KB',
  bankColor: '#FFB900',
  accountNumber: '12345678901234',
  holderName: '김우영',
  verified: true,
  registeredAt: '2026.01.15',
  verifiedAt: '2026.01.15',
}

export default function SettlementAccount() {
  const nav = useNavigate()
  const [account, setAccount] = useState(INITIAL_ACCOUNT)
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <PageWrapper>
      <Container>
      <BackLink onClick={() => nav('/host/settlement/dashboard')}>← 정산 대시보드</BackLink>

      <Header>
        <Title>정산 계좌 관리</Title>
        <Description>정산 받을 계좌를 등록·변경할 수 있어요</Description>
      </Header>

      <NoticeBox>
        <NoticeIcon>🔒</NoticeIcon>
        <NoticeContent>
          <NoticeTitle>계좌 정보는 안전하게 보호돼요</NoticeTitle>
          <NoticeText>
            은행 인증 시스템을 통해 계좌 소유자를 확인하며, 계좌번호는 암호화되어 저장됩니다.
          </NoticeText>
        </NoticeContent>
      </NoticeBox>

      <SectionHeader>
        <SectionTitle>등록된 계좌</SectionTitle>
        {account && (
          <Button variant="secondary" size="sm" onClick={() => setModalOpen(true)}>
            계좌 변경
          </Button>
        )}
      </SectionHeader>

      <AccountSection>
        <AccountCard account={account} />
      </AccountSection>

      {!account && (
        <RegisterButtonWrap>
          <Button variant="primary" size="lg" full onClick={() => setModalOpen(true)}>
            + 정산 계좌 등록하기
          </Button>
        </RegisterButtonWrap>
      )}

      <InfoSection>
        <InfoTitle>📌 정산 계좌 안내</InfoTitle>
        <InfoList>
          <li>정산 계좌는 본인 명의의 계좌만 등록 가능해요</li>
          <li>계좌 변경 시 1원 송금 인증을 다시 진행해야 해요</li>
          <li>월 정산일(매월 5일) 전까지 인증을 완료해야 정산을 받을 수 있어요</li>
          <li>최소 정산 금액(10,000원) 미만은 다음 달로 이월돼요</li>
          <li>인증 실패가 반복되면 일시적으로 등록이 제한될 수 있어요</li>
        </InfoList>
      </InfoSection>

      <AccountVerifyModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(newAccount) => {
          setAccount(newAccount)
          setModalOpen(false)
          alert('정산 계좌가 등록됐어요')
        }}
        isReVerify={!!account}
      />
    </Container>
    </PageWrapper>
  )
}

const PageWrapper = styled.div`
  background-color: var(--cream);
  min-height: 100%;
  padding: var(--space-6) var(--space-5);
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Container = styled.div`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  animation: fadeInUp 480ms ease-out both;
`

const BackLink = styled.button`
  font-size: 0.85rem;
  color: var(--gray-600);
  margin-bottom: var(--space-4);

  &:hover {
    color: var(--gray-800);
  }
`

const Header = styled.div`
  margin-bottom: var(--space-5);
`

const Title = styled.h1`
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 500;
  color: var(--gray-800);
  letter-spacing: -0.02em;
  margin-bottom: 4px;
`

const Description = styled.p`
  font-size: 0.9rem;
  color: var(--gray-600);
`

const NoticeBox = styled(Card)`
  display: flex;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--cream);
  margin-bottom: var(--space-5);
`

const NoticeIcon = styled.div`
  font-size: 1.5rem;
  flex-shrink: 0;
`

const NoticeContent = styled.div`
  flex: 1;
`

const NoticeTitle = styled.div`
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 4px;
`

const NoticeText = styled.div`
  font-size: 0.82rem;
  color: var(--gray-600);
  line-height: 1.5;
`

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
`

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: var(--gray-800);
`

const AccountSection = styled.div`
  margin-bottom: var(--space-5);
`

const RegisterButtonWrap = styled.div`
  margin-bottom: var(--space-5);
`

const InfoSection = styled.div`
  padding: var(--space-4);
  background: var(--gray-100);
  border-radius: var(--radius-md);
`

const InfoTitle = styled.div`
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: var(--space-3);
`

const InfoList = styled.ul`
  list-style: disc;
  padding-left: 20px;
  font-size: 0.82rem;
  color: var(--gray-600);
  line-height: 1.7;

  li {
    list-style: disc;
    margin-bottom: 4px;
  }
`
