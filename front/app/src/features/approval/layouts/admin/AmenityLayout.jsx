import React from 'react';
import styled from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';

export default function AmenityTableLayout({ children, title, onAddRow }) {
  return (
    <PageLayout title={title}>
      <TableCard>
        <HeaderActions>
          <Title />
          <AddButton onClick={onAddRow} title="편의시설 항목 추가">
            + 항목 추가
          </AddButton>
        </HeaderActions>

        <TableWrapper>{children}</TableWrapper>
      </TableCard>
    </PageLayout>
  );
}

const TableCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 1400px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const HeaderActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #f1f3f5;
  padding-bottom: 16px;
`;
const Title = styled.h2`
  font-size: 20px;
  color: #212529;
  font-weight: 700;
`;
const AddButton = styled.button`
  background-color: #212529;
  color: white;
  border: none;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background-color: #495057;
  }
`;
const TableWrapper = styled.div`
  overflow-x: auto;
`;
