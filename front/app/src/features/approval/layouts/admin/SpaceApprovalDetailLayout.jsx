import React from 'react';
import styled from 'styled-components';
import { FaChevronLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

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

const SpaceDetailLayout = ({ children, title, description }) => {
  const navigate = useNavigate();
  return (
    <Container>
      <BackButton onClick={() => navigate(-1)}>
        <FaChevronLeft /> 공간 검수 목록
      </BackButton>
      <Header>
        <h1>{title}</h1>
        <p>{description}</p>
      </Header>
      {children}
    </Container>
  );
};

export default SpaceDetailLayout;
