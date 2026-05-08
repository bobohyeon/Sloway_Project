import styled from 'styled-components'
import { Tabs } from '../../../pay_shared/components'

const DEFAULT_PERIODS = [
  { value: '3months', label: '최근 3개월' },
  { value: '6months', label: '최근 6개월' },
  { value: 'year', label: '최근 1년' },
  { value: 'all', label: '전체 기간' },
]

export function SettlementFilterBar({
  tabs,
  selectedTab,
  onTabChange,
  selectedPeriod,
  onPeriodChange,
  selectedSpace,
  onSpaceChange,
  spaces = [],
  periods = DEFAULT_PERIODS,
}) {
  return (
    <Wrap>
      <TabsWrap>
        <Tabs items={tabs} value={selectedTab} onChange={onTabChange} />
      </TabsWrap>

      <Filters>
        <Select value={selectedPeriod} onChange={(e) => onPeriodChange(e.target.value)}>
          {periods.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </Select>

        {spaces.length > 0 && (
          <Select value={selectedSpace} onChange={(e) => onSpaceChange(e.target.value)}>
            <option value="all">모든 공간</option>
            {spaces.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
        )}
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
