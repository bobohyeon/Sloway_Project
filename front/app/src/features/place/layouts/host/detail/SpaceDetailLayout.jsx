import React from 'react';
import styled from 'styled-components';
import PageLayout from './../../../../../app/layouts/page/PageLayout';

const PageWrapper = styled.div`
  background-color: #f4efe6;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1100px;
`;

function SpaceDetailLayout({ title, description, children, onBack }) {
  return (
    <PageWrapper>
      <Container>
        <PageLayout
          title={title}
          description={description}
          backTo={onBack}
          backLabel="내 공간 목록"
        >
          {children}
        </PageLayout>
      </Container>
    </PageWrapper>
  );
}

export default SpaceDetailLayout;
