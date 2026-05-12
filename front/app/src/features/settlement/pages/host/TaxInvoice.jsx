import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { Card, Section, Tabs, EmptyState, Pagination } from '../../../pay_shared/components'
import { TaxInvoiceItem } from '../../components/host/TaxInvoiceItem'

const INVOICES = [
  {
    id: 1,
    year: 2026,
    month: 4,
    invoiceNumber: 'TAX-202604-00847',
    title: '4월 정산 수수료 세금계산서',
    issuedDate: '2026.05.05',
    amount: 522500,
    status: 'issued',
  },
  {
    id: 2,
    year: 2026,
    month: 3,
    invoiceNumber: 'TAX-202603-00712',
    title: '3월 정산 수수료 세금계산서',
    issuedDate: '2026.04.05',
    amount: 396000,
    status: 'issued',
  },
  {
    id: 3,
    year: 2026,
    month: 2,
    invoiceNumber: 'TAX-202602-00598',
    title: '2월 정산 수수료 세금계산서',
    issuedDate: '2026.03.05',
    amount: 196000,
    status: 'issued',
  },
  {
    id: 4,
    year: 2026,
    month: 1,
    invoiceNumber: 'TAX-202601-00485',
    title: '1월 정산 수수료 세금계산서',
    issuedDate: '2026.02.05',
    amount: 490000,
    status: 'issued',
  },
  {
    id: 5,
    year: 2026,
    month: 5,
    invoiceNumber: 'TAX-202605-00919',
    title: '5월 정산 수수료 세금계산서',
    issuedDate: '2026.06.05 (예정)',
    amount: 693750,
    status: 'pending',
  },
]

const BUSINESS_INFO = {
  businessName: '청평 숲속 스테이',
  businessNumber: '123-45-67890',
  representative: '김우영',
  email: 'host@example.com',
  registered: true,
}

export default function TaxInvoice() {
  const nav = useNavigate()
  const [year, setYear] = useState('2026')
  const [page, setPage] = useState(1)

  const filtered = INVOICES.filter((inv) => String(inv.year) === year)

  const totalAmount = filtered
    .filter((inv) => inv.status === 'issued')
    .reduce((s, inv) => s + inv.amount, 0)

  return (
    <PageWrapper>
      <Container>
      <BackLink onClick={() => nav('/host/settlement/dashboard')}>← 정산 대시보드</BackLink>

      <Header>
        <Title>세금계산서</Title>
        <Description>월별로 발행된 수수료 세금계산서를 다운로드할 수 있어요</Description>
      </Header>

      <BusinessCard padded>
        <BusinessHeader>
          <BusinessIcon>🏢</BusinessIcon>
          <BusinessInfo>
            <BusinessLabel>등록된 사업자 정보</BusinessLabel>
            <BusinessName>{BUSINESS_INFO.businessName}</BusinessName>
          </BusinessInfo>
          <EditBtn onClick={() => alert('사업자 정보 수정 페이지로 이동')}>수정</EditBtn>
        </BusinessHeader>

        <BusinessGrid>
          <InfoItem>
            <InfoLabel>사업자등록번호</InfoLabel>
            <InfoValue>{BUSINESS_INFO.businessNumber}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>대표자</InfoLabel>
            <InfoValue>{BUSINESS_INFO.representative}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>이메일</InfoLabel>
            <InfoValue>{BUSINESS_INFO.email}</InfoValue>
          </InfoItem>
        </BusinessGrid>
      </BusinessCard>

      <SummaryRow>
        <SummaryItem>
          <SummaryLabel>{year}년 발행 건수</SummaryLabel>
          <SummaryValue>
            {filtered.filter((inv) => inv.status === 'issued').length}건
          </SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>{year}년 수수료 합계</SummaryLabel>
          <SummaryValue $highlight>{totalAmount.toLocaleString()}원</SummaryValue>
        </SummaryItem>
      </SummaryRow>

      <Section
        title="발행 내역"
        action={
          <Tabs
            items={[
              { value: '2026', label: '2026년' },
              { value: '2025', label: '2025년' },
            ]}
            value={year}
            onChange={setYear}
          />
        }
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon="📄"
            title="발행된 세금계산서가 없어요"
            description="해당 연도에 발행된 세금계산서가 없습니다"
          />
        ) : (
          <List>
            {filtered.map((inv) => (
              <TaxInvoiceItem
                key={inv.id}
                invoice={inv}
                onDownload={(item) => alert(`세금계산서 다운로드: ${item.invoiceNumber}`)}
              />
            ))}
          </List>
        )}
      </Section>

      <Pagination currentPage={page} totalPages={1} onChange={setPage} />

      <NoticeBox>
        <NoticeIcon>📌</NoticeIcon>
        <NoticeContent>
          <NoticeTitle>세금계산서 안내</NoticeTitle>
          <NoticeList>
            <li>매월 정산일(5일)에 전월 수수료에 대한 세금계산서가 자동 발행돼요</li>
            <li>발행된 세금계산서는 등록된 이메일로도 전송돼요</li>
            <li>사업자 정보가 변경되면 즉시 수정해주세요 (다음 달 발행분부터 적용)</li>
            <li>세금계산서는 5년간 보관됩니다</li>
          </NoticeList>
        </NoticeContent>
      </NoticeBox>
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
  max-width: 1200px;
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

const BusinessCard = styled(Card)`
  background: linear-gradient(135deg, var(--cream) 0%, var(--white) 100%);
  margin-bottom: var(--space-5);
`

const BusinessHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
`

const BusinessIcon = styled.div`
  width: 44px;
  height: 44px;
  background: var(--white);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
`

const BusinessInfo = styled.div`
  flex: 1;
`

const BusinessLabel = styled.div`
  font-size: 0.75rem;
  color: var(--gray-600);
  margin-bottom: 2px;
`

const BusinessName = styled.div`
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--gray-800);
`

const EditBtn = styled.button`
  padding: 6px 14px;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  font-size: 0.78rem;
  color: var(--gray-800);

  &:hover {
    border-color: var(--sage);
    background: var(--cream);
  }
`

const BusinessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
  padding-top: var(--space-3);
  border-top: 1px dashed var(--gray-200);

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const InfoItem = styled.div``

const InfoLabel = styled.div`
  font-size: 0.72rem;
  color: var(--gray-400);
  margin-bottom: 2px;
`

const InfoValue = styled.div`
  font-size: 0.85rem;
  color: var(--gray-800);
  font-weight: 500;
`

const SummaryRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
  margin-bottom: var(--space-5);

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`

const SummaryItem = styled.div`
  padding: var(--space-4);
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
`

const SummaryLabel = styled.div`
  font-size: 0.78rem;
  color: var(--gray-600);
  margin-bottom: 4px;
`

const SummaryValue = styled.div`
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 500;
  color: ${(props) => (props.$highlight ? 'var(--sage)' : 'var(--gray-800)')};
  letter-spacing: -0.02em;
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`

const NoticeBox = styled.div`
  display: flex;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--gray-100);
  border-radius: var(--radius-md);
  margin-top: var(--space-5);
`

const NoticeIcon = styled.div`
  font-size: 1.3rem;
  flex-shrink: 0;
`

const NoticeContent = styled.div`
  flex: 1;
`

const NoticeTitle = styled.div`
  font-size: 0.92rem;
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
`
