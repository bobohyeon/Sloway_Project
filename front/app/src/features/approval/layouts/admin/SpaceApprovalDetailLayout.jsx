import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../../../app/layouts/page/PageLayout';

const Container = styled.div`
  padding: 30px;
  padding-bottom: 150px; /* ⬅️ 하단 푸터 높이를 고려하여 여백을 대폭 추가 */
  background-color: #f4efe6;
  min-height: 100vh;
  box-sizing: border-box;
`;

const BackButton = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #888;
  cursor: pointer;
  margin-bottom: 20px;
  width: fit-content;

  &:hover {
    color: #333;
  }
`;

const Header = styled.div`
  margin-bottom: 30px;
  h1 {
    font-size: 24px;
    color: #333;
    margin-bottom: 8px;
    font-weight: 700;
  }
  p {
    font-size: 14px;
    color: #888;
  }
`;

const SpaceApprovalDetailLayout = ({ children, title, description }) => {
  const navigate = useNavigate();
  return (
    <Container>
      <PageLayout
        title={title}
        description={description}
        backLabel="공간 검수 목록"
        backTo={-1}
        children={children}
      />
    </Container>
  );
};

export default SpaceApprovalDetailLayout;
