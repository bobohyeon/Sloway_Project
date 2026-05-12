import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import PageLayout from '../../../../app/layouts/page/PageLayout'

import { Tabs, StatCard, EmptyState, Pagination, Button, Badge } from '../../../pay_shared/components'

const SETTLEMENTS = [
  {
    id: 1,
    settlementId: 'STL-20260513-00892',
    hostName: '청평 숲속 호스트',
    hostId: 'host_001',
    spaceName: '청평 숲속 파인뷰 스테이',
    spaceEmoji: '🌲',
    category: '워크앤스테이',
    bookingCount: 9,
    salesAmount: 5550000,
    feeAmount: 693750,
    payoutAmount: 4856250,
    bankName: '국민은행',
    maskedAccount: '1234-****-****',
    scheduledAt: '2026.05.13',
    completedAt: null,
    status: 'scheduled',
  },
  {
    id: 2,
    settlementId: 'STL-20260513-00891',
    hostName: '강릉 워크 호스트',
    hostId: 'host_002',
    spaceName: '강릉 바다향 코워킹',
    spaceEmoji: '🌊',
    category: '코워킹오피스',
    bookingCount: 14,
    salesAmount: 1960000,
    feeAmount: 196000,
    payoutAmount: 1764000,
    bankName: '신한은행',
    maskedAccount: '5678-****-****',
    scheduledAt: '2026.05.13',
    completedAt: null,
    status: 'scheduled',
  },
  {
    id: 3,
    settlementId: 'STL-20260513-00890',
    hostName: '남해 올리브 호스트',
    hostId: 'host_003',
    spaceName: '남해 올리브 팜스테이',
    spaceEmoji: '🫒',
    category: '숙소',
    bookingCount: 7,
    salesAmount: 3920000,
    feeAmount: 490000,
    payoutAmount: 3430000,
    bankName: '카카오뱅크',
    maskedAccount: '9012-****-****',
    scheduledAt: '2026.05.13',
    completedAt: null,
    status: 'pending',
    alertMessage: '계좌 인증 미완료 - 호스트 확인 필요',
  },
  {
    id: 4,
    settlementId: 'STL-20260509-00847',
    hostName: '청평 숲속 호스트',
    hostId: 'host_001',
    spaceName: '청평 숲속 파인뷰 스테이',
    spaceEmoji: '🌲',
    category: '워크앤스테이',
    bookingCount: 8,
    salesAmount: 4180000,
    feeAmount: 522500,
    payoutAmount: 3657500,
    bankName: '국민은행',
    maskedAccount: '1234-****-****',
    scheduledAt: '2026.05.09',
    completedAt: '2026.05.09 09:30',
    status: 'completed',
  },
  {
    id: 5,
    settlementId: 'STL-20260509-00845',
    hostName: '성수 브릭 호스트',
    hostId: 'host_004',
    spaceName: '성수 브릭라운지',
    spaceEmoji: '🧱',
    category: '코워킹오피스',
    bookingCount: 22,
    salesAmount: 980000,
    feeAmount: 98000,
    payoutAmount: 882000,
    bankName: '하나은행',
    maskedAccount: '3456-****-****',
    scheduledAt: '2026.05.09',
    completedAt: '2026.05.09 09:30',
    status: 'completed',
  },
]

const TABS = [
  { label: '전체', value: 'all', count: 5 },
  { label: '지급 예정', value: 'scheduled', count: 2 },
  { label: '보류', value: 'pending', count: 1 },
  { label: '완료', value: 'completed', count: 2 },
]

export default function AdminSettlementList() {
  const nav = useNavigate()
  const [tab, setTab] = useState('all')
  const [keyword, setKeyword] = useState('')

  const filtered = useMemo(() => {
    let list = SETTLEMENTS
    if (tab !== 'all') list = list.filter((s) => s.status === tab)
    if (keyword) {
      list = list.filter(
        (s) =>
          s.hostName.includes(keyword) ||
          s.spaceName.includes(keyword) ||
          s.settlementId.includes(keyword)
      )
    }
    return list
  }, [tab, keyword])

  const scheduled = SETTLEMENTS.filter((s) => s.status === 'scheduled')
  const pending = SETTLEMENTS.filter((s) => s.status === 'pending')
  const completed = SETTLEMENTS.filter((s) => s.status === 'completed')

  const totalScheduled = scheduled.reduce((sum, s) => sum + s.payoutAmount, 0)
  const totalCompleted = completed.reduce((sum, s) => sum + s.payoutAmount, 0)

  return (
    <PageLayout
      title="호스트 정산 관리"
      description="호스트 정산 상태를 확인하고 지급을 처리하세요"
      maxWidth={1200}
    >

      <StatGrid>
        <StatCard
          label="지급 예정"
          value={(totalScheduled / 10000).toLocaleString()}
          unit="만원"
          subText={`${scheduled.length}건 대기 중`}
        />
        <StatCard
          label="이번 주기 지급 완료"
          value={(totalCompleted / 10000).toLocaleString()}
          unit="만원"
          subText={`${completed.length}건 완료`}
        />
        <StatCard
          label="보류"
          value={pending.length}
          unit="건"
          subText="확인 필요"
          highlight={pending.length > 0}
        />
      </StatGrid>

      <FilterRow>
        <SearchBox>
          <SearchIcon>🔍</SearchIcon>
          <SearchInput
            placeholder="호스트명, 공간명, 정산번호로 검색"
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
          title="정산 내역이 없어요"
          description="해당 조건의 정산이 없습니다"
        />
      ) : (
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>정산번호</Th>
                <Th>호스트 / 공간</Th>
                <Th align="right">예약</Th>
                <Th align="right">매출액</Th>
                <Th align="right">수수료</Th>
                <Th align="right">지급액</Th>
                <Th>지급 예정일</Th>
                <Th align="center">상태</Th>
                <Th align="center">관리</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <Tr key={s.id} $alert={s.status === 'pending'}>
                  <Td>
                    <SettlementId>{s.settlementId}</SettlementId>
                  </Td>
                  <Td>
                    <HostInfo>
                      <SpaceEmoji>{s.spaceEmoji}</SpaceEmoji>
                      <HostDetails>
                        <HostName>{s.hostName}</HostName>
                        <SpaceName>{s.spaceName}</SpaceName>
                      </HostDetails>
                    </HostInfo>
                  </Td>
                  <Td align="right">{s.bookingCount}건</Td>
                  <Td align="right">{s.salesAmount.toLocaleString()}원</Td>
                  <Td align="right">
                    <FeeAmount>-{s.feeAmount.toLocaleString()}원</FeeAmount>
                  </Td>
                  <Td align="right">
                    <PayoutAmount>{s.payoutAmount.toLocaleString()}원</PayoutAmount>
                  </Td>
                  <Td>{s.scheduledAt}</Td>
                  <Td align="center">
                    {s.status === 'scheduled' && <Badge variant="info" size="sm">⏰ 예정</Badge>}
                    {s.status === 'pending' && <Badge variant="warning" size="sm">⚠️ 보류</Badge>}
                    {s.status === 'completed' && <Badge variant="success" size="sm">✓ 완료</Badge>}
                  </Td>
                  <Td align="center">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => nav(`/admin/settlement/host/${s.id}`)}
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
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
  margin-bottom: var(--space-5);

  @media (max-width: 720px) {
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

const SettlementId = styled.span`
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--gray-600);
`

const HostInfo = styled.div`
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

const HostDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const HostName = styled.div`
  font-weight: 500;
  color: var(--gray-800);
`

const SpaceName = styled.div`
  font-size: 0.75rem;
  color: var(--gray-600);
`

const FeeAmount = styled.span`
  color: #c44b3c;
  font-weight: 500;
`

const PayoutAmount = styled.span`
  color: var(--sage);
  font-weight: 600;
`
