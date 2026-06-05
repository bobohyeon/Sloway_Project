import styled from 'styled-components';
import { RANGE_PRESETS } from './statsRange';

export function StatsRangeTabs({ value, onChange }) {
  return (
    <Wrap>
      {RANGE_PRESETS.map((p) => (
        <Tab
          key={p.value}
          type="button"
          $active={value === p.value}
          onClick={() => onChange(p.value)}
        >
          {p.label}
        </Tab>
      ))}
    </Wrap>
  );
}

const Wrap = styled.div`
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  background: var(--gray-100);
  border-radius: var(--radius-full);
`;

const Tab = styled.button`
  padding: 6px 16px;
  border: none;
  border-radius: var(--radius-full);
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 0.82rem;
  font-weight: ${(p) => (p.$active ? 600 : 400)};
  color: ${(p) => (p.$active ? 'var(--gray-800)' : 'var(--gray-500)')};
  background: ${(p) => (p.$active ? 'var(--white)' : 'transparent')};
  box-shadow: ${(p) => (p.$active ? '0 1px 2px rgba(0, 0, 0, 0.06)' : 'none')};
  cursor: pointer;
  transition: all 160ms ease;

  &:hover {
    color: var(--gray-800);
  }
`;
