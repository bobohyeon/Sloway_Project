import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import AmenityTableLayout from '../../layouts/admin/AmenityLayout';
import Toggle from '../../components/admin/Toggle';
import AmenityRow from '../../components/admin/AmenityRow';
import { useAmenity } from '../../hooks/admin/useAmenity';

export default function AmenityPage() {
  const { amenityList, handleUpdate, handleAdd, handleRemove } = useAmenity([]);

  return (
    <AmenityTableLayout title="편의시설 관리" onAddRow={handleAdd}>
      <StyledTable>
        <thead>
          <tr>
            <th>편의시설 명</th>
            <th>공통</th>
            <th>워크스테이</th>
            <th>오피스</th>
            <th>숙소</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {amenityList.map((row) => (
            <AmenityRow
              key={row.no}
              row={row}
              onUpdate={handleUpdate}
              onRemove={handleRemove}
            />
          ))}
        </tbody>
      </StyledTable>
    </AmenityTableLayout>
  );
}

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  th {
    background-color: #f8f9fa;
    padding: 12px;
    border-bottom: 2px solid #dee2e6;
  }
  td {
    padding: 16px;
    border-bottom: 1px solid #dee2e6;
    text-align: center;
  }
`;
