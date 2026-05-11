import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { Card, Button, Tabs, EmptyState, Pagination } from '../../../pay_shared/components'
import { CashReceiptInfo } from '../../components/user/CashReceiptInfo'
import { EligiblePaymentItem } from '../../components/user/EligiblePaymentItem'
import { CashReceiptItem } from '../../components/user/CashReceiptItem'

const ELIGIBLE_PAYMENTS = [
  {
    paymentId: 'PAY-20260508-00921',
    spaceName: '청평 숲속 파인뷰 스테이',
    spaceEmoji: '🌲',
    paidAt: '2026.05.08',
    amount: 324050,
    daysLeft: 7,
  },
  {
    paymentId: 'PAY-20260506-00892',
    spaceName: '강릉 바다향 코워킹',
    spaceEmoji: '🌊',
    paidAt: '2026.05.06',
    amount: 28000,
    daysLeft: 5,
  },
  {
    paymentId: 'PAY-20260503-00845',
    spaceName: '성수 브릭라운지',
    spaceEmoji: '🧱',
    paidAt: '2026.05.03',
    amount: 56000,
    daysLeft: 2,
  },
]

const RECEIPTS = [
  {
    receiptId: 'CR-20260502-00128',
    spaceName: '강릉 바다향 코워킹',
    spaceEmoji: '🌊',
    amount: 240000,
    type: 'income',
    maskedId: '010-****-2390',
    issuedAt: '2026.05.02',
    status: 'issued',
  },
  {
    receiptId: 'CR-20260428-00115',
    spaceName: '남해 올리브 팜스테이',
    spaceEmoji: '🫒',
    amount: 330000,
    type: 'income',
    maskedId: '010-****-2390',
    issuedAt: '2026.04.28',
    status: 'issued',
  },
  {
    receiptId: 'CR-20260420-00098',
    spaceName: '북촌 한옥 워크룸',
    spaceEmoji: '🏯',
    amount: 180000,
    type: 'expense',
    maskedId: '123-45-67890',
    issuedAt: '2026.04.20',
    status: 'pending',
  },
  {
    receiptId: 'CR-20260415-00085',
    spaceName: '제주 흑돌 별채',
    spaceEmoji: '🌴',
    amount: 420000,
    type: 'income',
    maskedId: '010-****-2390',
    issuedAt: '2026.04.15',
    status: 'issued',
  },
]

export default function CashReceipt() {
  const nav = useNavigate()

  const [receiptType, setReceiptType] = useState('income')
  const [idType, setIdType] = useState('phone')
  const [idNumber, setIdNumber] = useState('')

  const [selected, setSelected] = useState([])
  const [tab, setTab] = useState('all')
  const [page, setPage] = useState(1)

  const filtered = RECEIPTS.filter((r) => {
    if (tab === 'all') return true
    return r.status === tab
  })

  const tabs = [
    { value: 'all', label: '전체', count: RECEIPTS.length },
    { value: 'issued', label: '발행 완료', count: RECEIPTS.filter((r) => r.status === 'issued').length },
    { value: 'pending', label: '신청 중', count: RECEIPTS.filter((r) => r.status === 'pending').length },
    { value: 'cancelled', label: '취소', count: RECEIPTS.filter((r) => r.status === 'cancelled').length },
  ]

  const handleSelectPayment = (payment) => {
    setSelected((prev) =>
      prev.find((p) => p.paymentId === payment.paymentId)
        ? prev.filter((p) => p.paymentId !== payment.paymentId)
        : [...prev, payment]
    )
  }

  const handleApplySingle = (payment) => {
    if (!idNumber || idNumber.length < 10) {
      alert('신원 확인 번호를 먼저 입력해주세요')
      return
    }
    alert(`${payment.spaceName} 결제 건에 대해 현금영수증을 신청했어요`)
  }

  const handleBulkApply = () => {
    if (!idNumber || idNumber.length < 10) {
      alert('신원 확인 번호를 먼저 입력해주세요')
      return
    }
    if (selected.length === 0) {
      alert('신청할 결제를 선택해주세요')
      return
    }
    alert(`${selected.length}건의 현금영수증을 일괄 신청했어요`)
    setSelected([])
  }

  // 발급 유형 바뀔 때 신원확인 타입 자동 조정
  const handleReceiptTypeChange = (type) => {
    setReceiptType(type)
    if (type === 'income') setIdType('phone')
    else setIdType('business')
    setIdNumber('')
  }

  return (
    <Page>
      <BackLink onClick={() => nav('/user/payment')}>← 결제 내역</BackLink>

      <Header>
        <Title>현금영수증</Title>
        <Description>결제 건에 대한 현금영수증을 신청·관리할 수 있어요</Description>
      </Header>

      <NoticeBox>
        <NoticeIcon>💡</NoticeIcon>
        <NoticeContent>
          <NoticeTitle>현금영수증 안내</NoticeTitle>
          <NoticeList>
            <li>결제 후 <strong>7일 이내</strong>에만 신청할 수 있어요</li>
            <li>신청 후에는 발급 정보를 변경할 수 없어요</li>
            <li>발행된 영수증은 국세청 홈택스에서 자동 조회돼요</li>
            <li>소득공제용은 휴대전화, 지출증빙용은 사업자번호로 신청해주세요</li>
          </NoticeList>
        </NoticeContent>
      </NoticeBox>

      <CashReceiptInfo
        receiptType={receiptType}
        onReceiptTypeChange={handleReceiptTypeChange}
        idType={idType}
        onIdTypeChange={setIdType}
        idNumber={idNumber}
        onIdNumberChange={setIdNumber}
      />

      <EligibleSection>
        <SectionHeader>
          <SectionTitle>
            신청 가능 결제 <Count>({ELIGIBLE_PAYMENTS.length})</Count>
          </SectionTitle>
          {selected.length > 0 && (
            <Button variant="primary" size="sm" onClick={handleBulkApply}>
              선택한 {selected.length}건 일괄 신청
            </Button>
          )}
        </SectionHeader>

        {ELIGIBLE_PAYMENTS.length === 0 ? (
          <EmptyState
            icon="📋"
            title="신청 가능한 결제가 없어요"
            description="결제 후 7일 이내인 결제 건만 신청 가능합니다"
          />
        ) : (
          <List>
            {ELIGIBLE_PAYMENTS.map((p) => (
              <EligiblePaymentItem
                key={p.paymentId}
                payment={p}
                selected={!!selected.find((s) => s.paymentId === p.paymentId)}
                onSelect={handleSelectPayment}
                onApply={handleApplySingle}
              />
            ))}
          </List>
        )}
      </EligibleSection>

      <HistorySection>
        <SectionHeader>
          <SectionTitle>발행 내역</SectionTitle>
        </SectionHeader>

        <TabsWrap>
          <Tabs items={tabs} value={tab} onChange={setTab} />
        </TabsWrap>

        {filtered.length === 0 ? (
          <EmptyState
            icon="📄"
            title="발행 내역이 없어요"
            description="신청한 현금영수증이 없습니다"
          />
        ) : (
          <List>
            {filtered.map((r) => (
              <CashReceiptItem
                key={r.receiptId}
                receipt={r}
                onDownload={(item) => alert(`현금영수증 다운로드: ${item.receiptId}`)}
                onCancel={(item) => {
                  if (window.confirm('현금영수증 신청을 취소하시겠어요?')) {
                    alert('신청 취소됐어요')
                  }
                }}
              />
            ))}
          </List>
        )}

        <Pagination currentPage={page} totalPages={1} onChange={setPage} />
      </HistorySection>
    </Page>
  )
}

const Page = styled.div`
  width: 100%;
  max-width: 800px;
  padding: var(--space-6) var(--space-5);
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
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 6px;
`

const NoticeList = styled.ul`
  list-style: disc;
  padding-left: 20px;
  font-size: 0.82rem;
  color: var(--gray-600);
  line-height: 1.7;

  li {
    list-style: disc;
    margin-bottom: 4px;
  }

  strong {
    color: var(--gray-800);
    font-weight: 600;
  }
`

const EligibleSection = styled.div`
  margin-top: var(--space-5);
  margin-bottom: var(--space-5);
`

const HistorySection = styled.div``

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
  flex-wrap: wrap;
  gap: var(--space-2);
`

const SectionTitle = styled.h3`
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--gray-800);
`

const Count = styled.span`
  color: var(--sage);
  font-weight: 600;
`

const TabsWrap = styled.div`
  margin-bottom: var(--space-3);
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`
