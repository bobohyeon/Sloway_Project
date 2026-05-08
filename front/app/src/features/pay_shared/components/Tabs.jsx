import styled, { css } from 'styled-components'

export function Tabs({ items, value, onChange }) {
  return (
    <Wrap>
      {items.map((item) => (
        <Tab
          key={item.value}
          $active={value === item.value}
          onClick={() => onChange(item.value)}
        >
          {item.label}
          {item.count !== undefined && (
            <Count $active={value === item.value}>{item.count}</Count>
          )}
        </Tab>
      ))}
    </Wrap>
  )
}

const Wrap = styled.div`
  display: inline-flex;
  gap: 4px;
  background: var(--gray-100);
  padding: 4px;
  border-radius: var(--radius-full);
`

const Tab = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: var(--radius-full);
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--gray-600);
  transition: all 160ms ease;

  &:hover {
    color: var(--gray-800);
  }

  ${(props) =>
    props.$active &&
    css`
      background: var(--white);
      color: var(--gray-800);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    `}
`

const Count = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 18px;
  padding: 0 6px;
  border-radius: var(--radius-full);
  font-size: 0.7rem;
  font-weight: 600;
  background: ${(props) => (props.$active ? 'var(--cream)' : 'var(--gray-200)')};
  color: ${(props) => (props.$active ? 'var(--sage)' : 'var(--gray-600)')};
`
