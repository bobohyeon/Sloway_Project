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

const TabBar = styled.div`
  display: flex;
  gap: 30px;
  margin-bottom: 25px;
  border-bottom: 1px solid #eee;
`;

const TabItem = styled.div`
  padding: 10px 5px;
  font-size: 16px;
  font-weight: ${(props) => (props.$active ? '700' : '400')};
  color: ${(props) => (props.$active ? '#768966' : '#999')};
  border-bottom: ${(props) =>
    props.$active ? '3px solid #768966' : '3px solid transparent'};
  cursor: pointer;
  transition: all 0.2s;

  span {
    font-size: 13px;
    margin-left: 4px;
    opacity: 0.7;
  }
`;

function SpaceDetailLayout({
  title,
  description,
  tabs,
  activeTab,
  onTabChange,
  children,
  summarySection,
}) {
  return (
    <PageWrapper>
      <Container>
        <Header>
          <h1>{title}</h1>
          <p>{description}</p>
        </Header>

        {summarySection}

        <TabBar>
          {tabs.map((tab) => (
            <TabItem
              key={tab.key}
              $active={activeTab === tab.key}
              onClick={() => onTabChange(tab.key)}
            >
              {tab.label} <span>{tab.count}</span>
            </TabItem>
          ))}
        </TabBar>

        {children}
      </Container>
    </PageWrapper>
  );
}

export default SpaceDetailLayout;
