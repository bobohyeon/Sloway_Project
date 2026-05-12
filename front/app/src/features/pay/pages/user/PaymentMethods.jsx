import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { Card, Button, Modal } from '../../../pay_shared/components'
import { PaymentMethodCard } from '../../components/user/PaymentMethodCard'
import { AddMethodCard } from '../../components/user/AddMethodCard'

const INITIAL_METHODS = [
  {
    id: 1,
    name: '카카오페이',
    icon: '💬',
    bg: '#FEE500',
    color: '#191919',
    subInfo: 'kakaotalk@****.com',
    isDefault: true,
  },
  {
    id: 2,
    name: '신한카드',
    icon: '💳',
    bg: '#0046FF',
    color: '#FFFFFF',
    subInfo: '****-****-****-1234',
    expiry: '06/28',
    isDefault: false,
  },
  {
    id: 3,
    name: '네이버페이',
    icon: 'N',
    bg: '#03C75A',
    color: '#FFFFFF',
    subInfo: 'naver@****.com',
    isDefault: false,
  },
]

const ADDABLE_METHODS = [
  { id: 'kakao', name: '카카오페이', icon: '💬', bg: '#FEE500', color: '#191919', desc: '카카오페이 Ready API 연동' },
  { id: 'naver', name: '네이버페이', icon: 'N', bg: '#03C75A', color: '#FFFFFF', desc: 'UI 시뮬레이션' },
  { id: 'toss', name: '토스페이', icon: 'T', bg: '#0064FF', color: '#FFFFFF', desc: 'UI 시뮬레이션' },
  { id: 'card', name: '신용/체크카드', icon: '💳', bg: '#FFFFFF', color: '#333333', desc: '카드 직접 등록' },
]

export default function PaymentMethods() {
  const nav = useNavigate()
  const [methods, setMethods] = useState(INITIAL_METHODS)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const handleSetDefault = (target) => {
    setMethods((prev) =>
      prev.map((m) => ({ ...m, isDefault: m.id === target.id }))
    )
  }

  const handleDelete = (target) => {
    setDeleteTarget(target)
  }

  const confirmDelete = () => {
    setMethods((prev) => prev.filter((m) => m.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  return (
    <PageWrapper>
      <Container>
      <Header>
        <BackLink onClick={() => nav('/user/payment')}>← 결제 내역으로</BackLink>
        <Title>결제 수단 관리</Title>
        <Description>자주 쓰는 결제 수단을 등록해두면 결제가 더 빨라져요</Description>
      </Header>

      <NoticeBox>
        <NoticeIcon>💡</NoticeIcon>
        <NoticeContent>
          <NoticeTitle>결제 수단은 안전하게 보관돼요</NoticeTitle>
          <NoticeText>
            카드 정보는 PG사를 통해 암호화되어 저장됩니다. Sloway는 카드 정보를 직접 보관하지 않아요.
          </NoticeText>
        </NoticeContent>
      </NoticeBox>

      <SectionHeader>
        <SectionTitle>등록된 결제 수단 ({methods.length})</SectionTitle>
        <Button variant="primary" size="sm" onClick={() => setAddModalOpen(true)}>
          + 추가하기
        </Button>
      </SectionHeader>

      <List>
        {methods.map((m) => (
          <PaymentMethodCard
            key={m.id}
            method={m}
            onSetDefault={handleSetDefault}
            onDelete={handleDelete}
          />
        ))}
        <AddMethodCard onClick={() => setAddModalOpen(true)} />
      </List>

      <Modal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="결제 수단 추가"
        maxWidth="480px"
      >
        <AddMethodGrid>
          {ADDABLE_METHODS.map((opt) => (
            <MethodOption
              key={opt.id}
              onClick={() => {
                setMethods((prev) => [
                  ...prev,
                  {
                    id: Date.now(),
                    name: opt.name,
                    icon: opt.icon,
                    bg: opt.bg,
                    color: opt.color,
                    subInfo: '새로 등록됨',
                    isDefault: false,
                  },
                ])
                setAddModalOpen(false)
              }}
            >
              <OptionIcon style={{ background: opt.bg, color: opt.color }}>
                {opt.icon}
              </OptionIcon>
              <OptionBody>
                <OptionName>{opt.name}</OptionName>
                <OptionDesc>{opt.desc}</OptionDesc>
              </OptionBody>
            </MethodOption>
          ))}
        </AddMethodGrid>
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="결제 수단 삭제"
        maxWidth="400px"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              취소
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              삭제
            </Button>
          </>
        }
      >
        <DeleteConfirm>
          <DeleteIcon>⚠️</DeleteIcon>
          <DeleteText>
            <strong>{deleteTarget?.name}</strong>을(를) 삭제할까요?
          </DeleteText>
          <DeleteSub>삭제 후에는 다시 등록해야 사용할 수 있어요.</DeleteSub>
        </DeleteConfirm>
      </Modal>
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

const Header = styled.div`
  margin-bottom: var(--space-5);
`

const BackLink = styled.button`
  font-size: 0.85rem;
  color: var(--gray-600);
  margin-bottom: var(--space-3);

  &:hover {
    color: var(--gray-800);
  }
`

const Title = styled.h1`
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 500;
  color: var(--gray-800);
  letter-spacing: -0.02em;
  margin-bottom: 6px;
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
  font-size: 0.9rem;
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

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`

const AddMethodGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`

const MethodOption = styled.button`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
  padding: var(--space-3) var(--space-4);
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  text-align: left;
  transition: all 160ms ease;

  &:hover {
    border-color: var(--sage);
    background: var(--cream);
  }
`

const OptionIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 700;
  flex-shrink: 0;
  border: 1px solid var(--gray-200);
`

const OptionBody = styled.div`
  flex: 1;
`

const OptionName = styled.div`
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 2px;
`

const OptionDesc = styled.div`
  font-size: 0.78rem;
  color: var(--gray-400);
`

const DeleteConfirm = styled.div`
  text-align: center;
  padding: var(--space-3) 0;
`

const DeleteIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: var(--space-3);
`

const DeleteText = styled.div`
  font-size: 1rem;
  color: var(--gray-800);
  margin-bottom: 4px;

  strong {
    color: var(--gray-800);
    font-weight: 600;
  }
`

const DeleteSub = styled.div`
  font-size: 0.82rem;
  color: var(--gray-600);
`
