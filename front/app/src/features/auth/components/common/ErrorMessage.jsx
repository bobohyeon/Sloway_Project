import React from 'react';
import styled from 'styled-components';
import { colors } from './AuthStyled';

const ErrorBox = styled.div`
  color: ${colors.error};
  font-size: 12px;
  margin-bottom: 12px;
  padding: 8px 12px;
  background: #fee;
  border-radius: 6px;
`;

function ErrorMessage({ message }) {
  if (!message) return null;
  return <ErrorBox>{message}</ErrorBox>;
}

export default ErrorMessage;
