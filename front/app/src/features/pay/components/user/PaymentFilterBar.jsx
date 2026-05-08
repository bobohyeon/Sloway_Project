import styled from 'styled-components'
import { Tabs } from '../../../pay_shared/components'

const DEFAULT_PERIODS = [
  { value: 'month', label: '이번 달' },
  { value: '3months', label: '최근 3개월' },
  { value: '6months', label: '최근 6개월' },
  { value: 'year', label: '최근 1년' },
  { value: 'all', label: '전체 기간' },
]

export function PaymentFilterBar({
  tabs,
  selectedTab,
  onTabChange,
  selectedPeriod,
  onPeriodChange,
  periods = DEFAULT_PERIODS,
}) {
  return (
    <Wrap>
      <Tabs items={tabs} value={selectedTab} onChange={onTabChange} />

      <Right>
        <Select value={selectedPeriod} onChange={(e) => onPeriodChange(e.target.value)}>
          {periods.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </Select>
      </Right>
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

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
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
