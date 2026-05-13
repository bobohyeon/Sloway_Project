import React from 'react';
import styled from 'styled-components';
import PageLayout from '../../../../../../app/layouts/page/PageLayout';

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

// Layout 컴포넌트는 타이틀, 서브타이틀, 그리고 내부 컨텐츠(children)를 인자로 받습니다.
function ImageUpdateLayout({ title, subtitle, onBack, children }) {
  return (
    <PageWrapper>
      <Container>
        <PageLayout
          title={title}
          description={subtitle}
          backTo={onBack}
          backLabel="내 공간 목록"
        >
          {/* 실제 페이지의 컨텐츠가 들어가는 자리 */}
          {children}
        </PageLayout>
      </Container>
    </PageWrapper>
  );
}

export default ImageUpdateLayout;
