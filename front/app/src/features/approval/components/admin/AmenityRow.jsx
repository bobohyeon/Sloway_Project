import React from 'react';
import styled from 'styled-components';
import Toggle from '../../components/admin/Toggle';

export default function AmenityRow({ row, onUpdate, onRemove }) {
  return (
    <tr>
      <td>
        <TableInput
          value={row.name || ''}
          onChange={(e) => onUpdate(row.no, 'name', e.target.value)}
        />
      </td>
      {/* 이제 모든 토글이 Y/N 변환을 명확하게 처리합니다 */}
      <td>
        <Toggle
          checked={row.commonYn === 'Y'}
          onChange={(val) => onUpdate(row.no, 'commonYn', val ? 'Y' : 'N')}
        />
      </td>
      <td>
        <Toggle
          checked={row.workStayYn === 'Y'}
          onChange={(val) => onUpdate(row.no, 'workStayYn', val ? 'Y' : 'N')}
        />
      </td>
      <td>
        <Toggle
          checked={row.officeYn === 'Y'}
          onChange={(val) => onUpdate(row.no, 'officeYn', val ? 'Y' : 'N')}
        />
      </td>
      <td>
        <Toggle
          checked={row.stationYn === 'Y'}
          onChange={(val) => onUpdate(row.no, 'stationYn', val ? 'Y' : 'N')}
        />
      </td>
      <td>
        <DeleteButton onClick={() => onRemove(row.no)}>✕</DeleteButton>
      </td>
    </tr>
  );
}

const TableInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
`;
const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #e03131;
  cursor: pointer;
  font-weight: bold;
`;
