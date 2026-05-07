import React from 'react';
import styled from 'styled-components';

const PageWrapper = styled.div`
  background-color: #f8f9f6;
  height: 92vh;
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

const TabContainer = styled.div`
  display: flex;
  gap: 30px;
  border-bottom: 1px solid #eee;
  margin-bottom: 25px;
  flex-shrink: 0; /* 탭 고정 */
`;

const Tab = styled.div`
  padding: 12px 5px;
  font-size: 15px;
  cursor: pointer;
  color: ${(props) => (props.$active ? '#333' : '#aaa')};
  font-weight: ${(props) => (props.$active ? 'bold' : 'normal')};
  border-bottom: ${(props) => (props.$active ? '2px solid #768966' : 'none')};
  display: flex;
  align-items: center;
  gap: 6px;

  span {
    background: ${(props) => (props.$active ? '#768966' : '#eee')};
    color: ${(props) => (props.$active ? 'white' : '#999')};
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 11px;
  }
`;

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;

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

function SpaceListLayout({
  activeTab,
  setActiveTab,
  counts,
  summarySection,
  listSection,
}) {
  const tabs = ['전체', '숙소', '워크앤스테이', '코워킹오피스'];

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

        {/* 탭 영역을 Layout으로 이동 */}
        <TabContainer>
          {tabs.map((tabName) => (
            <Tab
              key={tabName}
              $active={activeTab === tabName}
              onClick={() => setActiveTab(tabName)}
            >
              {tabName} <span>{counts[tabName] || 0}</span>
            </Tab>
          ))}
        </TabContainer>

        {/* 오직 리스트만 스크롤되는 영역 */}
        <ScrollArea>{listSection}</ScrollArea>
      </Container>
    </PageWrapper>
  );
}

export default SpaceListLayout;
