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
    font-weight: 800;
    color: #333;
    margin: 0;
  }
  p {
    font-size: 16px;
    color: #666;
    margin: 8px 0 0 0;
  }
`;

function SpaceDetailLayout({ title, description, children, summarySection }) {
  return (
    <PageWrapper>
      <Container>
        <Header>
          <h1>{title}</h1>
          <p>{description}</p>
        </Header>

        {summarySection}

        {children}
      </Container>
    </PageWrapper>
  );
}

export default SpaceDetailLayout;
