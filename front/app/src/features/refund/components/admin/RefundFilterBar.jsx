import styled from 'styled-components'
import { Tabs } from '../../../pay_shared/components'

const DEFAULT_PERIODS = [
  { value: 'today', label: '오늘' },
  { value: 'week', label: '최근 7일' },
  { value: 'month', label: '이번 달' },
  { value: '3months', label: '최근 3개월' },
  { value: 'all', label: '전체' },
]

export function RefundFilterBar({
  tabs,
  selectedTab,
  onTabChange,
  selectedPeriod,
  onPeriodChange,
  searchQuery,
  onSearchChange,
  periods = DEFAULT_PERIODS,
}) {
  return (
    <Wrap>
      <TabsWrap>
        <Tabs items={tabs} value={selectedTab} onChange={onTabChange} />
      </TabsWrap>

      <Filters>
        <SearchWrap>
          <SearchIcon>🔎</SearchIcon>
          <SearchInput
            type="text"
            placeholder="환불번호, 사용자명 검색"
            value={searchQuery || ''}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </SearchWrap>

        <Select value={selectedPeriod} onChange={(e) => onPeriodChange(e.target.value)}>
          {periods.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </Select>
      </Filters>
    </Wrap>
  )
}

const Wrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-5);
  flex-wrap: wrap;
`

const TabsWrap = styled.div`
  flex-shrink: 0;
`

const Filters = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
`

const SearchWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  transition: border-color 160ms ease;

  &:focus-within {
    border-color: var(--sage);
    box-shadow: 0 0 0 3px rgba(168, 184, 159, 0.15);
  }
`

const SearchIcon = styled.span`
  font-size: 0.85rem;
  opacity: 0.6;
`

const SearchInput = styled.input`
  border: none;
  outline: none;
  font-size: 0.85rem;
  width: 200px;
  background: transparent;

  &::placeholder {
    color: var(--gray-400);
  }
`

const Select = styled.select`
  padding: 8px 14px;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  color: var(--gray-800);
  cursor: pointer;
  outline: none;
  transition: border-color 160ms ease;

  &:hover {
    border-color: var(--sage);
  }

  &:focus {
    border-color: var(--sage);
    box-shadow: 0 0 0 3px rgba(168, 184, 159, 0.15);
  }
`
