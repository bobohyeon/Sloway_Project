import styled from 'styled-components';
import { Card, Section } from '../../../pay_shared/components';

export function DataTable({ title, columns, rows }) {
  return (
    <Section title={title}>
      <TableCard padded>
        <Table>
          <thead>
            <tr>
              {columns.map((c, i) => (
                <Th key={i} $right={i > 0}>
                  {c}
                </Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <EmptyTd colSpan={columns.length}>데이터가 없습니다.</EmptyTd>
              </tr>
            ) : (
              rows.map((r, ri) => (
                <tr key={ri}>
                  {r.map((cell, ci) => (
                    <Td key={ci} $right={ci > 0}>
                      {cell}
                    </Td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </TableCard>
    </Section>
  );
}

const TableCard = styled(Card)`
  padding: 0;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: ${({ $right }) => ($right ? 'right' : 'left')};
  padding: var(--space-3) var(--space-4);
  background: var(--gray-100);
  border-bottom: 1px solid var(--gray-200);
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--gray-600);
`;

const Td = styled.td`
  text-align: ${({ $right }) => ($right ? 'right' : 'left')};
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--gray-100);
  font-size: 0.88rem;
  color: var(--gray-800);
  font-family: ${({ $right }) => ($right ? 'var(--font-mono)' : 'inherit')};
`;

const EmptyTd = styled.td`
  padding: var(--space-6) var(--space-5);
  text-align: center;
  color: var(--gray-400);
  font-size: 0.85rem;
`;
