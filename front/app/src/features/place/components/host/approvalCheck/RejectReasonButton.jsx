import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  background: #fff;
  color: #c62828;
  border: 1px solid #ffcdd2;
  cursor: pointer;
  margin-left: 8px;

  &:hover {
    background: #ffebee;
  }
`;

function RejectReasonButton({ onClick }) {
  return <StyledButton onClick={onClick}>반려 사유 보기</StyledButton>;
}

export default RejectReasonButton;
