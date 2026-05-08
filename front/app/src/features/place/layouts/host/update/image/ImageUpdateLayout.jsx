import React from 'react';
import styled from 'styled-components';

const PageWrapper = styled.div`
  background-color: #f4efe6;
  min-height: 100vh;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1100px;
`;

const Header = styled.div`
  margin-bottom: 30px;
  h1 {
    font-size: 28px;
    color: #333;
    margin-bottom: 8px;
  }
  p {
    color: #888;
    font-size: 14px;
  }
`;

const BackLink = styled.div`
  color: #888;
  font-size: 14px;
  margin-bottom: 20px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

// Layout 컴포넌트는 타이틀, 서브타이틀, 그리고 내부 컨텐츠(children)를 인자로 받습니다.
function ImageUpdateLayout({ title, subtitle, onBack, children }) {
  return (
    <PageWrapper>
      <Container>
        <Header>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </Header>

        {onBack && <BackLink onClick={onBack}>← 내 공간 목록</BackLink>}

        {/* 실제 페이지의 컨텐츠가 들어가는 자리 */}
        {children}
      </Container>
    </PageWrapper>
  );
}

export default ImageUpdateLayout;
