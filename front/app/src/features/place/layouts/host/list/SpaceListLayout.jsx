import React from 'react';
import styled from 'styled-components';

const PageWrapper = styled.div`
  background-color: #f4efe6;
  min-height: 100vh;
  /* 하단 패딩을 넉넉히(예: 120px) 주어 푸터에 리스트가 가려지는 것을 방지합니다 */
  padding: 40px 20px 120px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 30px;

  .title-area h1 {
    font-size: 28px;
    font-weight: 800;
    color: #333;
    margin: 0;
  }

  .title-area p {
    font-size: 16px;
    color: #666;
    margin: 8px 0 0 0;
  }
`;

const ListContainer = styled.div`
  width: 100%;
  margin-top: 10px;
  /* 리스트 사이의 간격이 일정하게 유지되도록 합니다 */
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

function SpaceListLayout({ summarySection, listSection }) {
  return (
    <PageWrapper>
      <Container>
        <Header>
          <div className="title-area">
            <h1>내 공간 목록</h1>
            <p>운영 중인 공간을 관리하세요</p>
          </div>
        </Header>

        {summarySection}

        <ListContainer>{listSection}</ListContainer>
      </Container>
    </PageWrapper>
  );
}

export default SpaceListLayout;
