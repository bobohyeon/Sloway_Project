import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import PageLayout from '../../../../app/layouts/page/PageLayout'

import { Tabs, StatCard, EmptyState, Pagination, Button, Badge } from '../../../pay_shared/components'

const PAYMENTS = [
  {
    id: 'PAY-20260508-921',
    userName: '이재현',
    userEmail: 'jaehyun.lee@example.com',
    spaceName: '청평 숲속 파인뷰 스테이',
    spaceEmoji: '🌲',
    category: '워크앤스테이',
    method: '카카오페이',
    methodIcon: '💬',
    amount: 540000,
    paidAt: '2026.05.08 14:32',
    status: 'completed',
    pg: 'KG이니시스',
  },
  {
    id: 'PAY-20260508-918',
    userName: '박지수',
    userEmail: 'jisoo.park@example.com',
    spaceName: '강릉 바다향 코워킹',
    spaceEmoji: '🌊',
    category: '코워킹오피스',
    method: '신용카드',
    methodIcon: '💳',
    amount: 56000,
    paidAt: '2026.05.08 11:14',
    status: 'completed',
    pg: 'KG이니시스',
  },
  {
    id: 'PAY-20260508-917',
    userName: '김도현',
    userEmail: 'dohyun.kim@example.com',
    spaceName: '청평 숲속 파인뷰 스테이',
    spaceEmoji: '🌲',
    category: '워크앤스테이',
    method: '네이버페이',
    methodIcon: 'N',
    amount: 540000,
    paidAt: '2026.05.08 10:05',
    status: 'refunded',
    pg: '네이버페이',
  },
  {
    id: 'PAY-20260508-915',
    userName: '최민서',
    userEmail: 'minseo.choi@example.com',
    spaceName: '남해 올리브 팜스테이',
    spaceEmoji: '🫒',
    category: '숙소',
    method: '카카오페이',
    methodIcon: '💬',
    amount: 480000,
    paidAt: '2026.05.08 09:38',
    status: 'completed',
    pg: 'KG이니시스',
  },
  {
    id: 'PAY-20260507-912',
    userName: '정유나',
    userEmail: 'yuna.jung@example.com',
    spaceName: '강릉 바다향 코워킹',
    spaceEmoji: '🌊',
    category: '코워킹오피스',
    method: '토스페이',
    methodIcon: 'T',
    amount: 84000,
    paidAt: '2026.05.07 21:38',
    status: 'failed',
    pg: '토스페이먼츠',
    failReason: '카드 한도 초과',
  },
  {
    id: 'PAY-20260507-908',
    userName: '한승원',
    userEmail: 'seungwon.han@example.com',
    spaceName: '성수 브릭라운지',
    spaceEmoji: '🧱',
    category: '코워킹오피스',
    method: '카카오페이',
    methodIcon: '💬',
    amount: 28000,
    paidAt: '2026.05.07 18:22',
    status: 'completed',
    pg: 'KG이니시스',
  },
  {
    id: 'PAY-20260507-905',
    userName: '강하늘',
    userEmail: 'haneul.kang@example.com',
    spaceName: '청평 숲속 파인뷰 스테이',
    spaceEmoji: '🌲',
    category: '워크앤스테이',
    method: '신용카드',
    methodIcon: '💳',
    amount: 720000,
    paidAt: '2026.05.07 15:48',
    status: 'completed',
    pg: 'KG이니시스',
  },
  {
    id: 'PAY-20260507-898',
    userName: '윤서준',
    userEmail: 'seojun.yoon@example.com',
    spaceName: '양양 파도소리 빌라',
    spaceEmoji: '🌅',
    category: '숙소',
    method: '카카오페이',
    methodIcon: '💬',
    amount: 240000,
    paidAt: '2026.05.07 12:00',
    status: 'failed',
    pg: 'KG이니시스',
    failReason: '잔액 부족',
  },
]

const TABS = [
  { label: '전체', value: 'all', count: 8 },
  { label: '완료', value: 'completed', count: 5 },
  { label: '환불', value: 'refunded', count: 1 },
  { label: '실패', value: 'failed', count: 2 },
]

export default function AdminPaymentList() {
  const nav = useNavigate()
  const [tab, setTab] = useState('all')
  const [keyword, setKeyword] = useState('')

  const filtered = useMemo(() => {
    let list = PAYMENTS
    if (tab !== 'all') list = list.filter((p) => p.status === tab)
    if (keyword) {
      list = list.filter(
        (p) =>
          p.userName.includes(keyword) ||
          p.spaceName.includes(keyword) ||
          p.id.includes(keyword)
      )
    }
    return list
  }, [tab, keyword])

  const completed = PAYMENTS.filter((p) => p.status === 'completed')
  const refunded = PAYMENTS.filter((p) => p.status === 'refunded')
  const failed = PAYMENTS.filter((p) => p.status === 'failed')

  const totalAmount = completed.reduce((sum, p) => sum + p.amount, 0)

  return (
    <PageLayout
      title="전체 결제 내역"
      description="플랫폼 전체 결제 현황을 모니터링하세요"
      maxWidth={1200}
    >

      <StatGrid>
        <StatCard
          label="오늘 결제 완료"
          value={(totalAmount / 10000).toLocaleString()}
          unit="만원"
          subText={`${completed.length}건 완료`}
        />
        <StatCard
          label="환불"
          value={refunded.length}
          unit="건"
          subText="이번 주"
        />
        <StatCard
          label="결제 실패"
          value={failed.length}
          unit="건"
          subText="확인 필요"
          highlight={failed.length > 0}
        />
        <StatCard
          label="총 결제 건수"
          value={PAYMENTS.length}
          unit="건"
          subText="오늘"
        />
      </StatGrid>

      <FilterRow>
        <SearchBox>
          <SearchIcon>🔍</SearchIcon>
          <SearchInput
            placeholder="회원명, 공간명, 결제번호로 검색"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </SearchBox>
        <Button variant="secondary" onClick={() => alert('CSV 다운로드')}>
          📊 내보내기
        </Button>
      </FilterRow>

      <Tabs items={TABS} value={tab} onChange={setTab} />

      {filtered.length === 0 ? (
        <EmptyState
          icon="📭"
          title="결제 내역이 없어요"
          description="해당 조건의 결제가 없습니다"
        />
      ) : (
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>결제번호</Th>
                <Th>회원</Th>
                <Th>공간</Th>
                <Th>결제수단</Th>
                <Th align="right">금액</Th>
                <Th>결제일시</Th>
                <Th align="center">상태</Th>
                <Th align="center">관리</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <Tr key={p.id} $alert={p.status === 'failed'}>
                  <Td>
                    <PaymentId>{p.id}</PaymentId>
                  </Td>
                  <Td>
                    <UserInfo>
                      <UserName>{p.userName}</UserName>
                      <UserEmail>{p.userEmail}</UserEmail>
                    </UserInfo>
                  </Td>
                  <Td>
                    <SpaceInfo>
                      <SpaceEmoji>{p.spaceEmoji}</SpaceEmoji>
                      <SpaceDetails>
                        <SpaceName>{p.spaceName}</SpaceName>
                        <CategoryTag>{p.category}</CategoryTag>
                      </SpaceDetails>
                    </SpaceInfo>
                  </Td>
                  <Td>
                    <MethodInfo>
                      <MethodIcon>{p.methodIcon}</MethodIcon>
                      <MethodName>{p.method}</MethodName>
                    </MethodInfo>
                  </Td>
                  <Td align="right">
                    <Amount $refunded={p.status === 'refunded'}>
                      {p.amount.toLocaleString()}원
                    </Amount>
                  </Td>
                  <Td>
                    <DateText>{p.paidAt}</DateText>
                  </Td>
                  <Td align="center">
                    {p.status === 'completed' && <Badge variant="success" size="sm">✓ 완료</Badge>}
                    {p.status === 'refunded' && <Badge variant="info" size="sm">↻ 환불</Badge>}
                    {p.status === 'failed' && <Badge variant="danger" size="sm">✗ 실패</Badge>}
                  </Td>
                  <Td align="center">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => nav(`/admin/payment/${p.id}`)}
                    >
                      상세
                    </Button>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      )}

      <Pagination current={1} total={1} onChange={() => {}} />
    </PageLayout>
  )
}
const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-3);
  margin-bottom: var(--space-5);

  @media (max-width: 960px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`

const FilterRow = styled.div`
  display: flex;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
  align-items: center;
`

const SearchBox = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 10px 14px;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);

  &:focus-within {
    border-color: var(--sage);
  }
`

const SearchIcon = styled.span`
  color: var(--gray-400);
`

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.9rem;
  color: var(--gray-800);

  &::placeholder {
    color: var(--gray-400);
  }
`

const TableWrap = styled.div`
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin: var(--space-4) 0;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const Th = styled.th`
  padding: var(--space-3) var(--space-4);
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--gray-600);
  background: var(--cream);
  border-bottom: 1px solid var(--gray-200);
  text-align: ${(p) => p.align || 'left'};
  white-space: nowrap;
`

const Tr = styled.tr`
  background: ${(p) => (p.$alert ? 'rgba(220, 38, 38, 0.04)' : 'transparent')};
  border-bottom: 1px solid var(--gray-100);

  &:hover {
    background: var(--gray-100);
  }
`

const Td = styled.td`
  padding: var(--space-3) var(--space-4);
  font-size: 0.85rem;
  color: var(--gray-800);
  text-align: ${(p) => p.align || 'left'};
  vertical-align: middle;
`

const PaymentId = styled.span`
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--gray-600);
`

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const UserName = styled.div`
  font-weight: 500;
  color: var(--gray-800);
`

const UserEmail = styled.div`
  font-size: 0.75rem;
  color: var(--gray-600);
`

const SpaceInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
`

const SpaceEmoji = styled.div`
  width: 36px;
  height: 36px;
  background: var(--cream);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
`

const SpaceDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const SpaceName = styled.div`
  color: var(--gray-800);
`

const CategoryTag = styled.div`
  font-size: 0.72rem;
  color: var(--gray-600);
`

const MethodInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
`

const MethodIcon = styled.div`
  width: 28px;
  height: 28px;
  background: var(--cream);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 600;
`

const MethodName = styled.span`
  font-size: 0.85rem;
`

const Amount = styled.span`
  font-weight: 600;
  color: ${(p) => (p.$refunded ? 'var(--gray-400)' : 'var(--gray-800)')};
  text-decoration: ${(p) => (p.$refunded ? 'line-through' : 'none')};
`

const DateText = styled.span`
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--gray-600);
`
