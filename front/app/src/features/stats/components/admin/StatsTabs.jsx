import styled from 'styled-components';

export function StatsTabs({ active, onChange, tabs }) {
  return (
    <Bar>
      {tabs.map((t) => (
        <TabBtn
          key={t.key}
          $active={active === t.key}
          onClick={() => onChange(t.key)}
        >
          {t.label}
        </TabBtn>
      ))}
    </Bar>
  );
}

const Bar = styled.div`
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  background: var(--gray-100);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-5);
`;

const TabBtn = styled.button`
  padding: 6px 16px;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  background: ${({ $active }) => ($active ? 'var(--white)' : 'transparent')};
  color: ${({ $active }) => ($active ? 'var(--gray-800)' : 'var(--gray-600)')};
  box-shadow: ${({ $active }) =>
    $active ? '0 1px 3px rgba(0, 0, 0, 0.08)' : 'none'};
  transition: all 150ms ease;
`;
