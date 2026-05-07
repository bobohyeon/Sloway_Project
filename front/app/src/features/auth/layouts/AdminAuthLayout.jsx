import React from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';

const Wrap = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: #1e1d18;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
  box-sizing: border-box;
`;

function AdminAuthLayout() {
  return (
    <Wrap>
      <Outlet />
    </Wrap>
  );
}

export default AdminAuthLayout;
