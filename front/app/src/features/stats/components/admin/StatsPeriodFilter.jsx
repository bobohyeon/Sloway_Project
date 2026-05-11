import styled from 'styled-components'
import { Tabs } from '../../../pay_shared/components'

const DEFAULT_PERIODS = [
  { value: '7days', label: '7일' },
  { value: '30days', label: '30일' },
  { value: '90days', label: '90일' },
  { value: 'year', label: '1년' },
]

export function StatsPeriodFilter({
  selectedPeriod,
  onPeriodChange,
  startDate,
  endDate,
  onDownload,
  periods = DEFAULT_PERIODS,
}) {
  return (
    <Wrap>
      <Left>
        <Tabs items={periods} value={selectedPeriod} onChange={onPeriodChange} />
        {startDate && endDate && (
          <DateRange>
            <Icon>📅</Icon>
            <Mono>
              {startDate} ~ {endDate}
            </Mono>
          </DateRange>
        )}
      </Left>

      {onDownload && (
        <DownloadBtn onClick={onDownload}>📊 데이터 다운로드</DownloadBtn>
      )}
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

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
`

const DateRange = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--gray-100);
  border-radius: var(--radius-full);
  font-size: 0.78rem;
  color: var(--gray-600);
`

const Icon = styled.span`
  font-size: 0.85rem;
`

const Mono = styled.span`
  font-family: var(--font-mono);
`

const DownloadBtn = styled.button`
  padding: 8px 14px;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  font-size: 0.82rem;
  color: var(--gray-800);
  transition: all 160ms ease;

  &:hover {
    border-color: var(--sage);
    background: var(--cream);
  }
`
