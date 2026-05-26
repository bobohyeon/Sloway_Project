import React from 'react';
import styled from 'styled-components';
import PageLayout from './../../../../../app/layouts/page/PageLayout';

const PageWrapper = styled.div`
  background-color: #f4efe6;
  min-height: 100vh;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* 부모가 자식의 높이를 계산할 수 있도록 패딩 추가 */
  padding-bottom: 100px;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1100px;
  /* margin-bottom 300px은 하단 잘림의 원인이 되므로 제거하거나 줄이세요 */
  margin-bottom: 50px;
  flex: 1; /* 자식 요소가 공간을 효율적으로 차지하게 함 */
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
