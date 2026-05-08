import React from 'react';
import styled from 'styled-components';

const PageWrapper = styled.div`
  background-color: #f4efe6;
  height: 96vh;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1100px;
  height: 95%;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 30px;
  flex-shrink: 0;
`;

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
  min-height: 500px;
  max-height: 550px;

  /* 3px 스크롤바 디자인 */
  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #768966;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
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

        {/* 오직 리스트만 스크롤되는 영역 */}
        <ScrollArea>{listSection}</ScrollArea>
      </Container>
    </PageWrapper>
  );
}

export default SpaceListLayout;
