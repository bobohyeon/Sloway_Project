import React from 'react';
import styled from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';

const PageWrapper = styled.div`
  background-color: #f4efe6;
  min-height: 100vh;
  padding: 40px 20px 100px 20px; /* 푸터 고려 여백 */
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
    color: #888;
    margin: 8px 0 0 0;
  }
`;

const TabBar = styled.div`
  display: flex;
  gap: 25px;
  margin-bottom: 30px;
  border-bottom: 1px solid #e0e0e0;
`;

const TabItem = styled.div`
  padding: 12px 5px;
  font-size: 16px;
  font-weight: ${(props) => (props.$active ? '700' : '400')};
  color: ${(props) => (props.$active ? '#768966' : '#999')};
  border-bottom: ${(props) =>
    props.$active ? '3px solid #768966' : '3px solid transparent'};
  cursor: pointer;

  span {
    font-size: 13px;
    margin-left: 5px;
    opacity: 0.6;
  }
`;

function WishListLayout({ tabs, activeTab, onTabChange, children }) {
  return (
    <PageWrapper>
      <Container>
        <PageLayout
          title={'찜 목록'}
          description={'마음에 담아둔 공간들이에요'}
        >
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
        </PageLayout>
      </Container>
    </PageWrapper>
  );
}

export default WishListLayout;
